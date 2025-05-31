"use server";

import { createClient } from "@/supabase/server";
import { BackendResponse } from "@repo/types";
import { isReservedAddress } from "@/utils/blacklisted-email";
import { z } from "zod";
import OpenAI from "openai";
import { env } from "@/env.mjs";

import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const MODEL = "gpt-4.1";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const parseMailObjectiveZodSchema = z.object({
  mock: z.object({
    discussion: z
      .array(
        z.object({
          dialog: z
            .string()
            .describe(
              "a message from human to re-inforce the assistant's objective"
            ),
          response: z
            .string()
            .describe(
              "Assistant's response to the human's message, re-assuring the human of the assistant's objective"
            ),
        })
      )
      .describe("A mock conversation between the user and the assistant"),
  }),
  name: z.object({
    model_name: z.string().describe("The name of the AI assistant"),
  }),
  reit: z
    .array(z.string())
    .describe(
      "Main objective broken down into a list of reiterated smaller objectives for enforcement purposes and enhanced clarity. MUST NOT BE EMPTY"
    ),
  bothinst: z
    .object({
      role: z.string().describe("The role and purpose of the AI assistant"),
      task: z
        .string()
        .describe(
          "The primary objective and task of the AI assistant, should be well detailed"
        ),
    })
    .describe(
      "A detailed description of the role and purpose of the AI assistant"
    ),
  time_bound_objectives: z
    .array(
      z.object({
        time_bound_objective: z
          .string()
          .describe(
            "A time-bound objective for the AI assistant, can be an objective to enforce, based on the specific dates and time declared"
          ),
        constraint_rules: z
          .array(
            z.object({
              constraint: z
                .string()
                .describe(
                  "A condition that must be satisfied for the time-bound objective to be met"
                ),
              rule: z
                .string()
                .describe(
                  "A guideline that must be followed for the time-bound objective to be met"
                ),
              time_rule: z
                .string()
                .describe(
                  'Time definition for the rule, Must be in natural language adhering to the iCalendar RFC format, Eg. "every 5 weeks on Monday, Friday until January 31, 2013". Should not include the action, only the time definition'
                ),
              satisfies_constraint_action: z
                .string()
                .describe(
                  "The action to be taken if the constraint is met, do not include time details"
                ),
              does_not_satisfy_constraint_action: z
                .string()
                .describe(
                  "The action to be taken if the constraint is not met, do not include time details"
                ),
              iso_timestamp: z
                .string()
                .optional()
                .describe(
                  "An exact ISO 8601 format timestamp of the constraint's time (with dashes and colons). It represents a specific date and time, and must be calculated from the current time. This timestamp can denote either the time for an action to be taken or the time for the constraint to be met."
                ),
            })
          )
          .describe(
            "A list of constraints and rules for the time-bound objective"
          ),
      })
    )
    .optional()
    .describe(
      "A list of time-bound objectives for the AI assistant, leave empty if none, do not imply if empty"
    ),
});

// Helper functions for file processing
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    return `[Error extracting PDF content: ${error}]`;
  }
}

async function extractTextFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.convertToHtml({ buffer });
    const text = result.value.replace(/<[^>]*>/g, ""); // Strip HTML tags for plain text
    return text;
  } catch (error) {
    return `[Error extracting Word content: ${error}]`;
  }
}

async function processResourceWithAI(
  content: string,
  fileName: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an AI that analyzes business documents and extracts key information. Extract and summarize the most important business context, services, offerings, target audience, and any other relevant information that would help an AI assistant understand this business better. Return a structured summary.",
        },
        {
          role: "user",
          content: `Analyze this business document "${fileName}" and extract key business information:

${content}

Provide a structured summary focusing on:
- Business overview/description
- Services or products offered
- Target audience/market
- Key value propositions
- Important processes or methodologies
- Contact information or business details`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || content;
  } catch (error) {
    console.error("Error processing resource with AI:", error);
    return content;
  }
}

async function generateBusinessSummary(mailboxId: string): Promise<string> {
  try {
    const supabase = await createClient();

    const { data: resources, error } = await supabase
      .from("resources")
      .select("name, raw_content")
      .eq("mailbox_id", mailboxId);

    if (error || !resources || resources.length === 0) {
      return "No business resources available for analysis.";
    }

    const combinedContent = resources
      .map(
        (resource) =>
          `Document: ${resource.name}\n${resource.raw_content || "No content available"}`
      )
      .join("\n\n---\n\n");

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an AI that creates comprehensive business summaries from multiple documents. Analyze all provided business documents and create a cohesive summary that captures the essence of this business, its offerings, target market, and key differentiators.",
        },
        {
          role: "user",
          content: `Create a comprehensive business summary from these documents:

${combinedContent}

Provide a cohesive summary that includes:
- Overall business description and mission
- Complete list of services/products
- Target market and ideal customers
- Unique value propositions
- Business model and approach
- Key strengths and differentiators

This summary will be used to generate effective lead capture forms, so focus on information that would help qualify leads.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    return (
      response.choices[0]?.message?.content ||
      "Error generating business summary from uploaded resources."
    );
  } catch (error) {
    console.error("Error generating business summary:", error);
    return "Error generating business summary from uploaded resources.";
  }
}

// 1. Check if username exists and not in blacklist
export const checkUsernameAvailability = async (
  username: string
): Promise<BackendResponse<{ available: boolean; suggestions?: string[] }>> => {
  try {
    // Check if username is blacklisted
    if (isReservedAddress(username)) {
      return {
        success: false,
        message: 'This username is reserved and cannot be used',
        data: { available: false },
      };
    }

    // Check if username already exists in database
    const supabase = await createClient();
    const { data: existingMailbox, error } = await supabase
      .from('mailboxes')
      .select('unique_address')
      .eq('unique_address', username.toLowerCase())
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: 'Error checking username availability',
      };
    }

    if (existingMailbox) {
      // Generate suggestions
      const suggestions = [];
      for (let i = 1; i <= 3; i++) {
        const suggestion = `${username}${i}`;
        const { data: suggestionExists } = await supabase
          .from('mailboxes')
          .select('unique_address')
          .eq('unique_address', suggestion.toLowerCase())
          .maybeSingle();

        if (!suggestionExists && !isReservedAddress(suggestion)) {
          suggestions.push(suggestion);
        }
      }

      return {
        success: false,
        message: 'Username is already taken',
        data: { available: false, suggestions },
      };
    }

    return {
      success: true,
      message: 'Username is available',
      data: { available: true },
    };
  } catch {
    return {
      success: false,
      message: 'Error checking username availability',
    };
  }
};

// 2. Process mailbox objective with AI
export const processMailboxObjective = async (
  rawObjective: string
): Promise<BackendResponse<any>> => {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an AI that converts raw mailbox objectives into structured JSON format. The output must strictly follow the parseMailObjectiveZodSchema format with these fields:
- mock: { discussion: Array of { dialog: string, response: string } } - Sample conversation between user and assistant
- name: { model_name: string } - Name for the AI assistant
- reit: Array of strings - Main objectives broken down into smaller objectives (MUST NOT BE EMPTY)
- bothinst: { role: string, task: string } - Detailed role and task description
- time_bound_objectives: [{ time_bound_objective: string, constraint_rules: [{ constraint: string, rule: string, time_rule: string, satisfies_constraint_action: string, does_not_satisfy_constraint_action: string, iso_timestamp?: string }] }] (optional) - Optional array of time-based objectives with constraint rules


Constraints: 
- DO NOT INCLUDE CHARACTERS LIKE \\n, or similar that will mess up the JSON parser

Return ONLY valid JSON that matches this exact schema.`,
        },
        {
          role: 'user',
          content: `Convert this mailbox objective into the required JSON schema format:

Raw Objective: ${rawObjective}

The AI assistant will handle emails for this mailbox. Create appropriate mock conversations, break down the main objective into smaller ones, define the role and task clearly, and add time-bound objectives if relevant.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const processedObjectiveText = response.choices[0]?.message?.content;

    if (!processedObjectiveText) {
      throw new Error('No response from OpenAI');
    }

    const processedObjective = JSON.parse(processedObjectiveText);
    console.log(JSON.stringify(processedObjective, null, 2));
    const validatedData = parseMailObjectiveZodSchema.parse(processedObjective);

    return {
      success: true,
      message: 'Mailbox objective processed successfully',
      data: validatedData,
    };
  } catch (error) {
    console.error('Error processing mailbox objective:', error);
    return {
      success: false,
      message:
        'Error processing mailbox objective: ' +
        (error instanceof Error ? error.message : 'Unknown error'),
    };
  }
};

// 3. Create new mailbox for user
export const createMailboxForUser = async ({
  userId,
  unique_address,
  rawObjective,
  processedObjective,
}: {
  userId: string;
  unique_address: string;
  rawObjective: string;
  processedObjective: any;
}): Promise<BackendResponse<{ mailboxId: string }>> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('mailboxes')
      .insert({
        owner_id: userId,
        unique_address: unique_address.toLowerCase(),
        raw_objective: rawObjective,
        processed_objective: JSON.stringify(processedObjective),
      })
      .select('id')
      .single();

    if (error) {
      return {
        success: false,
        message:
          error.code === '23505' ? 'Username already exists' : error.message,
      };
    }

    return {
      success: true,
      message: 'Mailbox created successfully',
      data: { mailboxId: data.id },
    };
  } catch {
    return {
      success: false,
      message: 'Error creating mailbox',
    };
  }
};

// 4. Upload resources and create DB records
export const uploadResourcesForMailbox = async ({
  userId,
  mailboxId,
  resources,
}: {
  userId: string;
  mailboxId: string;
  resources: Array<{
    name: string;
    type: string;
    content?: string;
    file?: File;
  }>;
}): Promise<BackendResponse<{ resourceIds: string[] }>> => {
  try {
    const supabase = await createClient();
    const resourceIds: string[] = [];

    for (const resource of resources) {
      let filePath: string | null = null;
      let rawContent: string | null = resource.content || null;

      // If it's a file, upload to Supabase Storage
      if (resource.file) {
        const fileExtension = resource.file.name.split('.').pop();
        const fileName = `${Date.now()}_${resource.name}.${fileExtension}`;
        const storagePath = `resources/${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(storagePath, resource.file);

        if (uploadError) {
          continue; // Skip this resource if upload fails
        }

        filePath = storagePath;

        // Extract text content from different file types
        if (resource.file.type === 'text/plain') {
          rawContent = await resource.file.text();
        } else if (resource.file.type === 'application/pdf') {
          // For PDF files, you'd use a PDF parser like pdf-parse
          rawContent = await extractTextFromPDF(resource.file);
        } else if (
          resource.file.type.includes('word') ||
          resource.file.name.endsWith('.docx')
        ) {
          // For Word documents, you'd use mammoth or similar
          rawContent = await extractTextFromWord(resource.file);
        }
      }

      // Process any content (from file or direct input) with AI
      if (rawContent) {
        const processedContent = await processResourceWithAI(
          rawContent,
          resource.name
        );
        rawContent = processedContent;
      }

      // Create database record
      const { data, error } = await supabase
        .from('resources')
        .insert({
          owner_id: userId,
          mailbox_id: mailboxId,
          name: resource.name,
          type: resource.type,
          file_path: filePath,
          raw_content: rawContent,
        })
        .select('id')
        .single();

      if (!error && data) {
        resourceIds.push(data.id);
      }
    }

    return {
      success: true,
      message: `${resourceIds.length} resources uploaded successfully`,
      data: { resourceIds },
    };
  } catch {
    return {
      success: false,
      message: 'Error uploading resources',
    };
  }
};

// 5. Generate contact form templates using AI
export const generateFormTemplates = async ({
  processedObjective,
  resourcesSummary,
}: {
  processedObjective: any;
  resourcesSummary?: string;
}): Promise<BackendResponse<any[]>> => {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an AI that creates contact form templates based on business objectives and context. Generate 3-5 different form templates as JSON object with "templates" array.

Each template should have:
- name: string (descriptive name)
- description: string (what this form is for)
- fields: array of field objects with:
  - name: string (field identifier)
  - type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "radio"
  - label: string (user-facing label)
  - required: boolean
  - options?: string[] (for select/radio fields)
  - placeholder?: string (optional hint text)

Create forms that align with the business objective and help qualify leads effectively. Return JSON object with "templates" key containing the array.`,
        },
        {
          role: 'user',
          content: `Create contact form templates based on this business context:

Processed Objective: ${JSON.stringify(processedObjective, null, 2)}

${resourcesSummary ? `Business Resources Summary: ${resourcesSummary}` : ''}

Generate 3-5 form templates that would help this business capture and qualify leads effectively. Include a basic contact form, a detailed qualification form, and forms specific to their business model.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const templatesText = response.choices[0]?.message?.content;

    if (!templatesText) {
      throw new Error('No response from OpenAI');
    }

    const templatesResponse = JSON.parse(templatesText);
    const templates = templatesResponse.templates || templatesResponse;

    if (!Array.isArray(templates)) {
      throw new Error('AI response is not an array of templates');
    }

    return {
      success: true,
      message: 'Form templates generated successfully',
      data: templates,
    };
  } catch (error) {
    console.error('Error generating form templates:', error);
    return {
      success: false,
      message:
        'Error generating form templates: ' +
        (error instanceof Error ? error.message : 'Unknown error'),
    };
  }
};

// 6. Save user-selected form template
export const saveFormTemplate = async ({
  mailboxId,
  template,
  customizations,
}: {
  userId: string;
  mailboxId: string;
  template: any;
  customizations?: any;
}): Promise<BackendResponse<{ formId: string }>> => {
  try {
    const supabase = await createClient();

    // Generate slug from template name
    const slug = template.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Merge template with customizations
    const formFields = {
      ...template,
      ...customizations,
      fields: customizations?.fields || template.fields,
    };

    const { data, error } = await supabase
      .from('forms')
      .insert({
        mailbox_id: mailboxId,
        name: template.name,
        slug: slug,
        form_fields: formFields,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Form template saved successfully',
      data: { formId: data.id },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error saving form template',
    };
  }
};

// Complete onboarding workflow
export const completeOnboardingWorkflow = async ({
  userId,
  unique_address,
  rawObjective,
  resources,
}: {
  userId: string;
  unique_address: string;
  rawObjective: string;
  resources?: Array<{
    name: string;
    type: string;
    content?: string;
    file?: File;
  }>;
}): Promise<
  BackendResponse<{
    mailboxId: string;
    formTemplates: any[];
  }>
> => {
  try {
    // Step 1: Check username availability
    const usernameCheck = await checkUsernameAvailability(unique_address);
    if (!usernameCheck.success || !usernameCheck.data?.available) {
      return usernameCheck as any;
    }

    // Step 2: Process objective
    const processedObjectiveResult =
      await processMailboxObjective(rawObjective);
    if (!processedObjectiveResult.success) {
      return processedObjectiveResult as any;
    }

    // Step 3: Create mailbox
    const mailboxResult = await createMailboxForUser({
      userId,
      unique_address,
      rawObjective,
      processedObjective: processedObjectiveResult.data,
    });
    if (!mailboxResult.success) {
      return mailboxResult as any;
    }

    const mailboxId = mailboxResult.data!.mailboxId;

    // Step 4: Upload resources (if provided)
    let resourcesSummary: string | undefined;
    if (resources && resources.length > 0) {
      const resourcesResult = await uploadResourcesForMailbox({
        userId,
        mailboxId,
        resources,
      });

      if (resourcesResult.success) {
        // Generate a business summary from all uploaded resources
        resourcesSummary = await generateBusinessSummary(mailboxId);
      }
    }

    // Step 5: Generate form templates
    const templatesResult = await generateFormTemplates({
      processedObjective: processedObjectiveResult.data,
      resourcesSummary,
    });

    if (!templatesResult.success) {
      return templatesResult as any;
    }

    return {
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        mailboxId,
        formTemplates: templatesResult.data!,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error completing onboarding workflow',
    };
  }
};

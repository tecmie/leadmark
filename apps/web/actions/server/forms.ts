"use server";

import { createClient } from "@/supabase/server";
import { BackendResponse } from "@repo/types";
import { env } from "@/env.mjs";

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormData {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  mailbox: {
    unique_address: string;
    dotcom: string;
  };
}

// Get form by slug/ID
export const getFormBySlug = async (
  slug: string
): Promise<BackendResponse<FormData>> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('forms')
      .select(`
        id,
        name,
        form_fields,
        mailbox:mailboxes (
          unique_address,
          dotcom
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      return {
        success: false,
        message: 'Form not found',
      };
    }

    const formFields = data.form_fields as any;
    
    return {
      success: true,
      message: 'Form fetched successfully',
      data: {
        id: data.id,
        name: formFields.name || 'Contact Form',
        description: formFields.description || '',
        fields: formFields.fields || [],
        mailbox: Array.isArray(data.mailbox) ? data.mailbox[0] : data.mailbox,
      },
    };
  } catch (error) {
    console.error('Error fetching form:', error);
    return {
      success: false,
      message: 'Error fetching form',
    };
  }
};

// Submit form response
export const submitFormResponse = async ({
  formId,
  responseData,
  leadEmail,
  leadName,
  mailboxAddress,
  mailboxDomain,
}: {
  formId: string;
  responseData: Record<string, any>;
  leadEmail: string;
  leadName?: string;
  mailboxAddress: string;
  mailboxDomain: string;
}): Promise<BackendResponse<{ responseId: string }>> => {
  try {
    const supabase = await createClient();

    // First, save the form response to the database
    const { data: responseRecord, error: responseError } = await supabase
      .from('form_responses')
      .insert({
        form_id: formId,
        lead_email: leadEmail,
        lead_name: leadName,
        response_data: responseData,
      })
      .select('id')
      .single();

    if (responseError) {
      console.error('Error saving form response:', responseError);
      return {
        success: false,
        message: 'Error saving form response',
      };
    }

    // Prepare the email data for the backend API
    const emailData = {
      FromName: leadName || leadEmail.split('@')[0],
      MessageStream: "inbound",
      From: leadEmail,
      FromFull: {
        Email: leadEmail,
        Name: leadName || leadEmail.split('@')[0]
      },
      To: `${mailboxAddress}@${mailboxDomain}`,
      ToFull: [
        {
          Email: `${mailboxAddress}@${mailboxDomain}`,
          Name: mailboxAddress,
          Method: "To"
        }
      ],
      Cc: "",
      CcFull: [],
      Bcc: "",
      BccFull: [],
      Subject: `New form submission from ${leadName || leadEmail}`,
      Date: new Date().toUTCString(),
      TextBody: generateEmailBody(responseData, leadName, leadEmail),
      StrippedTextReply: "",
      Headers: [
        {
          Name: "X-Form-Response-ID",
          Value: responseRecord.id
        },
        {
          Name: "X-Form-ID", 
          Value: formId
        }
      ],
      Attachments: []
    };

    // Send to backend API
    const backendUrl = env.BACKEND_API_URL;
    const response = await fetch(`${backendUrl}/api/postman`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'leadmark-form-submission',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      console.error('Backend API error:', response.status, response.statusText);
      // Even if backend fails, we still saved the response, so it's partially successful
      return {
        success: true,
        message: 'Form submitted successfully (email notification may be delayed)',
        data: { responseId: responseRecord.id },
      };
    }

    return {
      success: true,
      message: 'Form submitted successfully',
      data: { responseId: responseRecord.id },
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      message: 'Error submitting form',
    };
  }
};

// Helper function to generate email body from form data
function generateEmailBody(
  responseData: Record<string, any>,
  leadName?: string,
  leadEmail?: string
): string {
  let body = `New form submission received:\n\n`;
  
  if (leadName) {
    body += `Name: ${leadName}\n`;
  }
  if (leadEmail) {
    body += `Email: ${leadEmail}\n`;
  }
  
  body += `\nForm Data:\n`;
  body += `${'-'.repeat(40)}\n`;
  
  Object.entries(responseData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '' && value !== false) {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (typeof value === 'boolean') {
        body += `${formattedKey}: ${value ? 'Yes' : 'No'}\n`;
      } else if (Array.isArray(value)) {
        body += `${formattedKey}: ${value.join(', ')}\n`;
      } else if (key.toLowerCase().includes('date') && typeof value === 'string') {
        // Format date fields nicely
        try {
          const date = new Date(value);
          body += `${formattedKey}: ${date.toLocaleDateString()}\n`;
        } catch {
          body += `${formattedKey}: ${value}\n`;
        }
      } else if (key.toLowerCase().includes('url') && typeof value === 'string') {
        // Make URLs clickable in email
        body += `${formattedKey}: ${value}\n`;
      } else {
        body += `${formattedKey}: ${value}\n`;
      }
    }
  });
  
  body += `\n${'-'.repeat(40)}\n`;
  body += `Submitted at: ${new Date().toLocaleString()}\n`;
  body += `\nThis lead was captured through your automated form system.\n`;
  
  return body;
}

// Get all forms for a user
export const getUserForms = async (
  userId: string
): Promise<BackendResponse<any[]>> => {
  try {
    const supabase = await createClient();

    // First get user's mailboxes, then get forms for those mailboxes
    const { data: mailboxes, error: mailboxError } = await supabase
      .from('mailboxes')
      .select('id')
      .eq('owner_id', userId);

    if (mailboxError || !mailboxes?.length) {
      return {
        success: true,
        message: 'No forms found',
        data: [],
      };
    }

    const mailboxIds = mailboxes.map(m => m.id);

    const { data, error } = await supabase
      .from('forms')
      .select(`
        id,
        name,
        slug,
        form_fields,
        is_active,
        created_at,
        updated_at,
        mailbox:mailboxes (
          unique_address,
          dotcom
        ),
        responses:form_responses (
          id,
          created_at
        )
      `)
      .in('mailbox_id', mailboxIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user forms:', error);
      return {
        success: false,
        message: 'Error fetching forms',
      };
    }

    // Process the data to include response counts and form URLs
    const processedForms = data.map(form => {
      const mailbox = Array.isArray(form.mailbox) ? form.mailbox[0] : form.mailbox;
      const formFields = form.form_fields as any;
      
      return {
        id: form.id,
        name: form.name,
        slug: form.slug,
        description: formFields?.description || '',
        fieldCount: formFields?.fields?.length || 0,
        responseCount: form.responses?.length || 0,
        isActive: form.is_active,
        createdAt: form.created_at,
        updatedAt: form.updated_at,
        formUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://leadmark.email'}/form/${form.slug}`,
        mailboxAddress: mailbox ? `${mailbox.unique_address}@${mailbox.dotcom}` : null,
      };
    });

    return {
      success: true,
      message: 'Forms fetched successfully',
      data: processedForms,
    };
  } catch (error) {
    console.error('Error fetching user forms:', error);
    return {
      success: false,
      message: 'Error fetching forms',
    };
  }
};

// Toggle form active status
export const toggleFormStatus = async (
  formId: string,
  isActive: boolean
): Promise<BackendResponse<null>> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('forms')
      .update({ is_active: isActive })
      .eq('id', formId);

    if (error) {
      console.error('Error updating form status:', error);
      return {
        success: false,
        message: 'Error updating form status',
      };
    }

    return {
      success: true,
      message: `Form ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: null,
    };
  } catch (error) {
    console.error('Error updating form status:', error);
    return {
      success: false,
      message: 'Error updating form status',
    };
  }
};

// Delete a form
export const deleteForm = async (
  formId: string
): Promise<BackendResponse<null>> => {
  try {
    const supabase = await createClient();

    // First check if there are any responses
    const { data: responses, error: responseError } = await supabase
      .from('form_responses')
      .select('id')
      .eq('form_id', formId)
      .limit(1);

    if (responseError) {
      console.error('Error checking form responses:', responseError);
      return {
        success: false,
        message: 'Error checking form responses',
      };
    }

    if (responses && responses.length > 0) {
      return {
        success: false,
        message: 'Cannot delete form with existing responses. Deactivate it instead.',
      };
    }

    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId);

    if (error) {
      console.error('Error deleting form:', error);
      return {
        success: false,
        message: 'Error deleting form',
      };
    }

    return {
      success: true,
      message: 'Form deleted successfully',
      data: null,
    };
  } catch (error) {
    console.error('Error deleting form:', error);
    return {
      success: false,
      message: 'Error deleting form',
    };
  }
};

// Get form responses for analytics
export const getFormResponses = async (
  formId: string
): Promise<BackendResponse<any[]>> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('form_responses')
      .select(`
        id,
        lead_email,
        lead_name,
        response_data,
        qualification_score,
        qualification_status,
        created_at
      `)
      .eq('form_id', formId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching form responses:', error);
      return {
        success: false,
        message: 'Error fetching form responses',
      };
    }

    return {
      success: true,
      message: 'Form responses fetched successfully',
      data: data || [],
    };
  } catch (error) {
    console.error('Error fetching form responses:', error);
    return {
      success: false,
      message: 'Error fetching form responses',
    };
  }
};

// Create a new form directly (not through onboarding)
export const createNewForm = async ({
  userId,
  name,
  description,
  fields,
}: {
  userId: string;
  name: string;
  description: string;
  fields: FormField[];
}): Promise<BackendResponse<{ formId: string; formUrl: string }>> => {
  try {
    const supabase = await createClient();

    // First get user's mailbox
    const { data: mailbox, error: mailboxError } = await supabase
      .from('mailboxes')
      .select('id, unique_address, dotcom')
      .eq('owner_id', userId)
      .single();

    if (mailboxError || !mailbox) {
      return {
        success: false,
        message: 'User mailbox not found. Please complete onboarding first.',
      };
    }

    // Generate slug from form name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existingForm } = await supabase
        .from('forms')
        .select('id')
        .eq('slug', slug)
        .eq('mailbox_id', mailbox.id)
        .maybeSingle();

      if (!existingForm) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create form fields object
    const formFields = {
      name,
      description,
      fields,
    };

    const { data, error } = await supabase
      .from('forms')
      .insert({
        mailbox_id: mailbox.id,
        name,
        slug,
        form_fields: formFields as any,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating form:', error);
      return {
        success: false,
        message: 'Error creating form',
      };
    }

    const formUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://leadmark.email'}/form/${slug}`;

    return {
      success: true,
      message: 'Form created successfully',
      data: {
        formId: data.id,
        formUrl,
      },
    };
  } catch (error) {
    console.error('Error creating form:', error);
    return {
      success: false,
      message: 'Error creating form',
    };
  }
};
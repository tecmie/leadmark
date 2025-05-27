"use server";

import { createClient } from "@/supabase/server";
import {
  ActionTypeEnum,
  BackendResponse,
  Forwarder,
  Payment,
  UpdateForwarderActionOptions,
  UpdatePaymentDetailsActionOptions,
} from "@repo/types";
import { fetchMailbox } from "./mailbox";
import { emailIsValid } from "@/utils/email";

export const fetchForwarderTool = async (
  userId: string
): Promise<BackendResponse<string>> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tools")
    .select("credentials")
    .eq("owner_id", userId)
    .eq("name", ActionTypeEnum.FORWARDER)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error?.message,
    };
  }

  return {
    success: true,
    message: "Forwarder action fetched successfully",
    data: (data.credentials as Forwarder)?.forward_to,
  };
};

export const fetchPaymentInfo = async (
  userId: string
): Promise<BackendResponse<Payment>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tools")
    .select()
    .eq("owner_id", userId)
    .eq("name", ActionTypeEnum.PAYMENT)
    .select();

  if (error) {
    return {
      success: false,
      message: error?.message,
    };
  }

  return {
    success: true,
    message: "Payment details action fetched successfully",
    data: data?.[0]?.schema as Payment,
  };
};

export const updatePaymentDetailsAction = async ({
  userId,
  payment,
}: UpdatePaymentDetailsActionOptions): Promise<BackendResponse<boolean>> => {
  const supabase = await createClient();

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  const { data, error } = await supabase
    .from("tools")
    .select()
    .eq("owner_id", userId)
    .eq("name", ActionTypeEnum.PAYMENT);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const { error: updateError } =
    data.length > 0
      ? await supabase
          .from("tools")
          .update({
            enabled: true,
            mailbox_id: mailboxId,
            owner_id: userId,
            name: ActionTypeEnum.PAYMENT,
            context_space: "global",
            schema: payment,
          })
          .eq("owner_id", userId)
          .eq("name", ActionTypeEnum.PAYMENT)
          .select()
      : await supabase
          .from("tools")
          .insert({
            enabled: true,
            mailbox_id: mailboxId,
            owner_id: userId,
            name: ActionTypeEnum.PAYMENT,
            context_space: "global",
            schema: payment,
          })
          .select();

  if (updateError) {
    return {
      success: false,
      message: updateError.message,
    };
  }

  return {
    success: true,
    message: "Payment details action updated successfully",
  };
};

export const updateForwarderAction = async ({
  email,
  userId,
}: UpdateForwarderActionOptions): Promise<BackendResponse<boolean>> => {
  const supabase = await createClient();

  if (!emailIsValid(email)) {
    return {
      success: false,
      message: "Email address is not valid",
    };
  }

  const mailboxId = (await fetchMailbox(userId)).data?.id;

  const existingRecord = await supabase
    .from("tools")
    .select()
    .eq("owner_id", userId)
    .eq("name", ActionTypeEnum.FORWARDER);

  const { error } = existingRecord.data?.length
    ? await supabase
        .from("tools")
        .update({
          enabled: true,
          mailbox_id: mailboxId,
          owner_id: userId,
          name: ActionTypeEnum.FORWARDER,
          instructions:
            "Use this to escalate when you're stuck or lack clarity to move forward.",
          context_space: "global",
          credentials: {
            forward_to: email,
          },
        })
        .eq("owner_id", userId)
        .eq("name", ActionTypeEnum.FORWARDER)
        .select()
    : await supabase
        .from("tools")
        .insert({
          enabled: true,
          mailbox_id: mailboxId,
          owner_id: userId,
          name: ActionTypeEnum.FORWARDER,
          instructions:
            "Use this to escalate when you're stuck or lack clarity to move forward.",
          context_space: "global",
          credentials: {
            forward_to: email,
          },
        })
        .select();

  if (error) {
    return {
      success: false,
      message: error?.message,
    };
  }

  return {
    success: true,
    message: "Forwarder action updated successfully",
  };
};

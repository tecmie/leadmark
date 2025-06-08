"use server";

import { createClient } from "@/supabase/server";
import {
  ActionTypeEnum,
  BackendResponse
} from "@repo/types";

type Forwarder = {
  forward_to: string;
};

type Payment = {
  amount: number;
  currency: string;
  description?: string;
};

type UpdateForwarderActionOptions = {
  email: string;
  userId: string;
};

type UpdatePaymentDetailsActionOptions = {
  userId: string;
  payment: Payment;
};
import { fetchMailbox } from "./mailbox";
import { emailIsValid } from "@/utils/email";

export const fetchForwarderTool = async (
  userId: string
): Promise<BackendResponse<string>> => {
  // TODO: Implement tools table in database schema
  return {
    success: false,
    message: "Tools functionality not yet implemented - missing 'tools' table",
  };
};

export const fetchPaymentInfo = async (
  userId: string
): Promise<BackendResponse<Payment>> => {
  // TODO: Implement tools table in database schema
  return {
    success: false,
    message: "Tools functionality not yet implemented - missing 'tools' table",
  };
};

export const updatePaymentDetailsAction = async ({
  userId,
  payment,
}: UpdatePaymentDetailsActionOptions): Promise<BackendResponse<boolean>> => {
  // TODO: Implement tools table in database schema
  return {
    success: false,
    message: "Tools functionality not yet implemented - missing 'tools' table",
  };
};

export const updateForwarderAction = async ({
  email,
  userId,
}: UpdateForwarderActionOptions): Promise<BackendResponse<boolean>> => {
  // TODO: Implement tools table in database schema
  if (!emailIsValid(email)) {
    return {
      success: false,
      message: "Email address is not valid",
    };
  }

  return {
    success: false,
    message: "Tools functionality not yet implemented - missing 'tools' table",
  };
};

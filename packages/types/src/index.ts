import { Database } from "./database.types.js";

export type Enums = any;

export type BackendResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

export enum ActionTypeEnum {
  PAYMENT = "PAYMENT_DETAILS_ACTION",
  FORWARDER = "MAIL_FORWARDER_ACTION",
}

export type OnboardingStatusType =
  | "account_created"
  | "mailbox_created"
  | "forwarder_created"
  | "links_created";

export type ViewSignIn = "sign_in";
export type ViewSignUp = "sign_up";
export type ViewMagicLink = "magic_link";
export type ViewForgottenPassword = "forgotten_password";
export type ViewUpdatePassword = "update_password";
export type ViewVerifyOtp = "verify_otp";
export type ViewType =
  | ViewSignIn
  | ViewSignUp
  | ViewMagicLink
  | ViewForgottenPassword
  | ViewUpdatePassword
  | ViewVerifyOtp;

export type CreateAccountOptions = any;
export type LoginOptions = any;
export type OauthOptions = any;
export type ResetPasswordOptions = any;
export type UpdatePasswordOptions = any;

export type Thread = any;
export type Message = any;
export type TypeMessageAttachment = any;

export type IUser = Database["public"]["Tables"]["profiles"]["Row"];
export type IMailbox = Database["public"]["Tables"]["mailboxes"]["Row"];

export type IMailboxWithIUser = IMailbox & { owner: IUser | {}[] };

// Table Row Types
export type IFormResponse =
  Database["public"]["Tables"]["form_responses"]["Row"];
export type IForm = Database["public"]["Tables"]["forms"]["Row"];
export type IMeeting = Database["public"]["Tables"]["meetings"]["Row"];
export type IMessageAttachment =
  Database["public"]["Tables"]["message_attachments"]["Row"];
export type IMessage = Database["public"]["Tables"]["messages"]["Row"];
export type IProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type IResource = Database["public"]["Tables"]["resources"]["Row"];
export type IThread = Database["public"]["Tables"]["threads"]["Row"];
export type IContact = Database["public"]["Tables"]["contacts"]["Row"];

// Enums
export type MeetingStatus = Database["public"]["Enums"]["meeting_status"];
export type QualificationStatus =
  Database["public"]["Enums"]["qualification_status"];
export type ThreadStatus = Database["public"]["Enums"]["thread_status"];


export type InsertMessageBase = Database['public']['Tables']['messages']['Insert'];
export type InsertMessageAttachmentBase = Database['public']['Tables']['message_attachments']['Insert'];

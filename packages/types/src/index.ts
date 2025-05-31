export type Enums = any;

export type BackendResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

export type IUser = any;

export enum ActionTypeEnum {
  PAYMENT = 'PAYMENT_DETAILS_ACTION',
  FORWARDER = 'MAIL_FORWARDER_ACTION',
}
export type Forwarder = any;
export type Payment = any;
export type UpdateForwarderActionOptions = any;
export type UpdatePaymentDetailsActionOptions = any;
export type MailboxBaseWithUserBase = any;
export type MessageBase = any;
export type ForwardedMessageBase = any;

export type UniqueFilenameOptions = any;
export type Tables = any;
export type DeleteFileResourceOptions = any;
export type DownloadFileResourceOptions = any;
export type FetchFileResourceOptions = any;
export type FileResource = any;
export type Resource = any;
export type UploadFileResourceOptions = any;
export type MailBox = any;
export type UpsertMailboxOptions = any;
export type UploadResourceOptions = {
  userId: string;
  resources: {
    name?: string;
    resourceUrl: string;
    resourceType: any;
    contextSpace: any;
    rawMetadata: {
      sizeInBytes: number;
      fullUrl: string;
    };
  }[];
};

export enum OnboardingStatusEnum {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum OnboardingStepEnum {
  NOT_STARTED = 'not_started',
  SETUP_MAIL = 'setup_mail',
  RESOURCE = 'resource',
  CHOOSE_TEMPLATE = 'choose_template',
  CUSTOMIZE = 'customize',
  WELCOME = 'welcome',
}

export type OnboardingStatusType = `${OnboardingStatusEnum}`;
export type OnboardingStepType = `${OnboardingStepEnum}`;

export type ViewSignIn = 'sign_in';
export type ViewSignUp = 'sign_up';
export type ViewMagicLink = 'magic_link';
export type ViewForgottenPassword = 'forgotten_password';
export type ViewUpdatePassword = 'update_password';
export type ViewVerifyOtp = 'verify_otp';
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
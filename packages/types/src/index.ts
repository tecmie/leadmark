export type Enums = any;

export type BackendResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

export type GPTIUser = any;

export enum ActionTypeEnum {
  PAYMENT = "PAYMENT_DETAILS_ACTION",
  FORWARDER = "MAIL_FORWARDER_ACTION",
}
export type Forwarder = any;
export type Payment = any;
export type UpdateForwarderActionOptions = any;
export type UpdatePaymentDetailsActionOptions = any;

export type UniqueFilenameOptions = any;
export type Tables = any;
export type DeleteFileResourceOptions = any;
export type OnboardingStatusType = any;
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

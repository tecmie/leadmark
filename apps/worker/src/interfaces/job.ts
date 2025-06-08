export interface JobData {
  [key: string]: any;
}

export interface JobResult {
  message: string;
  data?: any;
  processedAt?: Date;
}

export type JobType = 'email' | 'data-processing' | 'default';

export interface CreateJobRequest {
  type?: JobType;
  data?: JobData;
}

export interface JobResponse {
  success: boolean;
  jobId?: string;
  message?: string;
  error?: string;
}

export interface JobStatusResponse {
  success: boolean;
  job?: {
    id: string;
    name: string;
    data: JobData;
    progress: number;
    processedOn?: number;
    finishedOn?: number;
    failedReason?: string;
  };
  error?: string;
}
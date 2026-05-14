export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";

export type IssueCreateRequest = {
  title: string;
  description: string;
  reproductionSteps?: string | null;
  reporterContact?: string | null;
};

export type IssueResponse = {
  id: number;
  status: IssueStatus;
  createdAt: string;
};

export type ApiErrorResponse = {
  error: string;
};

export type BugReportField =
  | "title"
  | "description"
  | "reproductionSteps"
  | "reporterContact";

export type BugReportFormValues = {
  title: string;
  description: string;
  reproductionSteps: string;
  reporterContact: string;
};

export type FieldErrors = Partial<Record<BugReportField, string>>;

export type SubmitIssueResult =
  | { kind: "success"; issue: IssueResponse }
  | { kind: "validation"; fieldErrors: FieldErrors; message?: string }
  | { kind: "server"; message: string }
  | { kind: "network"; message: string };

import type {
  ApiErrorResponse,
  BugReportFormValues,
  FieldErrors,
  IssueCreateRequest,
  IssueResponse,
  SubmitIssueResult,
} from "@/types/issues";

const DEFAULT_API_BASE_URL = "https://group-2-9289.onrender.com";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
}

function buildIssuePayload(values: BugReportFormValues): IssueCreateRequest {
  const payload: IssueCreateRequest = {
    title: values.title.trim(),
    description: values.description.trim(),
  };

  const reproductionSteps = values.reproductionSteps.trim();
  const reporterContact = values.reporterContact.trim();

  if (reproductionSteps) {
    payload.reproductionSteps = reproductionSteps;
  }

  if (reporterContact) {
    payload.reporterContact = reporterContact;
  }

  return payload;
}

function normalizeFieldReference(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function mapApiErrorToFieldErrors(errorMessage: string): FieldErrors {
  const normalized = normalizeFieldReference(errorMessage);
  const fieldErrors: FieldErrors = {};

  if (normalized.includes("title")) {
    fieldErrors.title = errorMessage;
  }

  if (normalized.includes("description")) {
    fieldErrors.description = errorMessage;
  }

  if (normalized.includes("reproductionsteps")) {
    fieldErrors.reproductionSteps = errorMessage;
  }

  if (normalized.includes("reportercontact")) {
    fieldErrors.reporterContact = errorMessage;
  }

  return fieldErrors;
}

function validateClient(values: BugReportFormValues): FieldErrors {
  const fieldErrors: FieldErrors = {};

  if (!values.title.trim()) {
    fieldErrors.title = "Title is required.";
  }

  if (!values.description.trim()) {
    fieldErrors.description = "Description is required.";
  }

  return fieldErrors;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorResponse;

    if (typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }
  } catch {
    // Fall through to a generic message when the body is not JSON.
  }

  return "The server could not accept this report. Please try again.";
}

export async function submitIssue(
  values: BugReportFormValues,
): Promise<SubmitIssueResult> {
  const fieldErrors = validateClient(values);

  if (Object.keys(fieldErrors).length > 0) {
    return { kind: "validation", fieldErrors };
  }

  const payload = buildIssuePayload(values);

  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      try {
        const issue = (await response.json()) as IssueResponse;
        return { kind: "success", issue };
      } catch {
        return {
          kind: "server",
          message:
            "The server accepted the report, but the response was invalid. Please try again.",
        };
      }
    }

    const message = await parseErrorMessage(response);

    if (response.status === 400) {
      const apiFieldErrors = mapApiErrorToFieldErrors(message);

      if (Object.keys(apiFieldErrors).length > 0) {
        return { kind: "validation", fieldErrors: apiFieldErrors, message };
      }

      return {
        kind: "validation",
        fieldErrors: {},
        message,
      };
    }

    return { kind: "server", message };
  } catch {
    return {
      kind: "network",
      message:
        "We could not reach the bug tracker service. Your report is still here so you can try again.",
    };
  }
}

"use client";

import { useState } from "react";
import { submitIssue } from "@/lib/issues";
import type {
  BugReportField,
  BugReportFormValues,
  FieldErrors,
  IssueResponse,
} from "@/types/issues";

const emptyValues: BugReportFormValues = {
  title: "",
  description: "",
  reproductionSteps: "",
  reporterContact: "",
};

type FormFieldProps = {
  id: BugReportField;
  label: string;
  required?: boolean;
  hint?: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (field: BugReportField, value: string) => void;
  multiline?: boolean;
};

function FormField({
  id,
  label,
  required = false,
  hint,
  value,
  error,
  disabled,
  onChange,
  multiline = false,
}: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const inputClassName =
    "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 disabled:cursor-not-allowed disabled:bg-slate-100";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(id, event.target.value)}
          className={`${inputClassName} resize-y min-h-32`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(id, event.target.value)}
          className={inputClassName}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SuccessBanner({
  issue,
  onSubmitAnother,
}: {
  issue: IssueResponse;
  onSubmitAnother: () => void;
}) {
  const createdAt = new Date(issue.createdAt);

  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-emerald-200 bg-success-bg p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-success">Report received</h2>
      <p className="mt-2 text-sm leading-6 text-success">
        Your bug report was submitted successfully. Reference #{issue.id} is
        currently marked as <span className="font-medium">{issue.status}</span>.
      </p>
      <p className="mt-2 text-sm text-success/80">
        Submitted{" "}
        {Number.isNaN(createdAt.getTime())
          ? issue.createdAt
          : createdAt.toLocaleString()}
        .
      </p>
      <button
        type="button"
        onClick={onSubmitAnother}
        className="mt-5 inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-success transition hover:bg-emerald-50"
      >
        Submit another report
      </button>
    </section>
  );
}

export function BugReportForm() {
  const [values, setValues] = useState<BugReportFormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<IssueResponse | null>(
    null,
  );

  function updateField(field: BugReportField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    if (fieldErrors[field]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }

    if (formMessage) {
      setFormMessage(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);
    setFieldErrors({});

    try {
      const result = await submitIssue(values);

      if (result.kind === "success") {
        setSubmittedIssue(result.issue);
        setValues(emptyValues);
        setFieldErrors({});
        return;
      }

      if (result.kind === "validation") {
        setFieldErrors(result.fieldErrors);

        if (result.message) {
          setFormMessage(result.message);
        }

        return;
      }

      setFormMessage(result.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmitAnother() {
    setSubmittedIssue(null);
    setFormMessage(null);
    setFieldErrors({});
  }

  if (submittedIssue) {
    return (
      <SuccessBanner issue={submittedIssue} onSubmitAnother={handleSubmitAnother} />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-6">
        <FormField
          id="title"
          label="Title"
          required
          value={values.title}
          error={fieldErrors.title}
          disabled={isSubmitting}
          onChange={updateField}
        />

        <FormField
          id="description"
          label="Description"
          required
          multiline
          value={values.description}
          error={fieldErrors.description}
          disabled={isSubmitting}
          onChange={updateField}
        />

        <FormField
          id="reproductionSteps"
          label="Reproduction steps"
          hint="Optional. List the steps that trigger the issue."
          multiline
          value={values.reproductionSteps}
          error={fieldErrors.reproductionSteps}
          disabled={isSubmitting}
          onChange={updateField}
        />

        <FormField
          id="reporterContact"
          label="Contact email"
          hint="Optional. We will only use this to follow up on your report."
          value={values.reporterContact}
          error={fieldErrors.reporterContact}
          disabled={isSubmitting}
          onChange={updateField}
        />
      </div>

      {formMessage ? (
        <p
          className="mt-6 rounded-xl border border-red-200 bg-error-bg px-4 py-3 text-sm text-error"
          role="alert"
        >
          {formMessage}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Required fields are marked with an asterisk.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit bug report"}
        </button>
      </div>
    </form>
  );
}

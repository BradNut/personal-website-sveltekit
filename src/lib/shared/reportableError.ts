type ReportableErrorInput = {
  status: number;
  error: unknown;
};

function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object' || !('status' in error)) {
    return null;
  }

  const { status } = error;

  return typeof status === 'number' ? status : null;
}

export function isReportableError({ status, error }: ReportableErrorInput): boolean {
  const effectiveStatus = getErrorStatus(error) ?? status;

  return effectiveStatus < 400 || effectiveStatus >= 500;
}

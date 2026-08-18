import { isReportableError } from './reportableError';

const GENERIC_ERROR_MESSAGE = 'Whoops!';

type CaptureContext = {
  extra: {
    event: unknown;
    errorId: string;
    status: number;
  };
};

type CaptureAdapter = (error: unknown, context: CaptureContext) => unknown;

type ReportErrorInput = {
  error: unknown;
  event: unknown;
  status: number;
  capture: CaptureAdapter;
};

type ErrorReport = {
  message: string;
  errorId?: string;
};

export function reportError({ error, event, status, capture }: ReportErrorInput): ErrorReport {
  if (!isReportableError({ error, status })) {
    return {
      message: GENERIC_ERROR_MESSAGE,
    };
  }

  const errorId = crypto.randomUUID();

  try {
    capture(error, { extra: { event, errorId, status } });
  } catch {
    // A tracking outage must never change what the visitor sees.
  }

  return {
    message: GENERIC_ERROR_MESSAGE,
    errorId,
  };
}

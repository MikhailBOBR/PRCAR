export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла непредвиденная ошибка.";
}

export function getErrorStatus(error: unknown) {
  if (error instanceof AppError) {
    return error.status;
  }

  return 500;
}

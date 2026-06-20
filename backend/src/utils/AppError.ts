class AppError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(
    status: number,
    message: string,
    errors?: { field: string; message: string }[],
  ) {
    super(message);

    this.status = status || 500;
    this.errors = errors;
  }
}

export default AppError;

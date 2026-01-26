export class AppError extends Error {
  constructor(message, status, data = null, error = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.error = error;
  }
}

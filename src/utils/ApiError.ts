export class ApiError extends Error {
  private statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message); this.name = 'ApiError';
  }
  isBadRequest() { return this.status === 400; }
  isUnauthorized() { return this.status === 401; }
  isForbidden() { return this.status === 403; }
  isNotFound() { return this.status === 404; }
  isConflict() { return this.status === 409; }
  isServerError() { return this.status >= 500; }
}

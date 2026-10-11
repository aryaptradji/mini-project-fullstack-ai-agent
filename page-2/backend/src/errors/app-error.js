export class AppError extends Error {
  constructor(status, title, detail, errors) { super(detail); this.status = status; this.title = title; this.errors = errors; }
}

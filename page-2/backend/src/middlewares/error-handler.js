export function errorHandler(err, req, res, _next) {
  const status = err.status || (err.type === 'entity.parse.failed' ? 400 : 500);
  const title = err.title || (status === 400 ? 'Bad Request' : status === 404 ? 'Not Found' : 'Internal Server Error');
  if (status >= 500) console.error(JSON.stringify({ level: 'error', requestId: req.id, message: err.message }));
  const problem = { type: 'about:blank', title, status, detail: status >= 500 ? 'An unexpected error occurred.' : err.message, instance: req.originalUrl };
  if (err.errors) problem.errors = err.errors;
  res.status(status).type('application/problem+json').json(problem);
}

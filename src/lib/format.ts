export function formatErr(error: object | string) {
  return typeof error === 'string' ? error : JSON.stringify(error, ['message', 'arguments', 'type', 'name']);
}

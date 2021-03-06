// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isErrorLike = (value: any): value is { message: string } => (
  typeof value === 'object'
  && value !== null
  && 'message' in value
  && typeof value.message === 'string'
);

export default isErrorLike;

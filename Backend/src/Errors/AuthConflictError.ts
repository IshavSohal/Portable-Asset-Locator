export default class AuthConflictError extends Error {
    constructor(message: string, public code: number) {
      super(message);
      this.name = 'DBConflictError';
    }
}
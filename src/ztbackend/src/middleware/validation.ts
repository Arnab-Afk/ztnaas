// src/middleware/validation.ts
export function validateRequest(schema: any) {
  return async (request: Request, env: any, ctx: any, next: any) => {
    // Stub: always passes validation
    return next();
  };
}

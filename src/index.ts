// Generated OpenAPI types
import type {
  paths as AuthPaths,
  operations as AuthOperations,
  components as AuthComponents,
} from './generated/auth.js';
import type {
  paths as CorePaths,
  operations as CoreOperations,
  components as CoreComponents,
} from './generated/core.js';

export type AuthAPI = AuthPaths;
export type CoreAPI = CorePaths;

export type {
  AuthPaths,
  AuthOperations,
  AuthComponents,
  CorePaths,
  CoreOperations,
  CoreComponents,
};

// Re-export events schemas, types, and parseEvent
export * from './events.js';

// Common API envelope response types matching auth-service and core-api
export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

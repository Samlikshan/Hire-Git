export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HttpMessage {
  OK = "Request successful",
  CREATED = "Resource created",
  BAD_REQUEST = "Invalid request",
  UNAUTHORIZED = "Unauthorized access",
  NOT_FOUND = "Resource not found",
  INTERNAL_ERROR = "Internal server error",
}

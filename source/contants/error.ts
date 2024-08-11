export type Error =
  // common error
  | 'UNKNOWN_ERROR'
  | 'INVALID_INPUT'

  // auth error
  | 'AUTH_FAILED'
  | 'AUTH_TOKEN_EXPIRED'

  // user error
  | 'USER_NOT_EXISTS'
  | 'USER_ALREADY_EXISTS'


const messages: Record<Error, string> = {
  'UNKNOWN_ERROR': 'Unknown error',
  'INVALID_INPUT': 'Invalid input',
  'AUTH_FAILED': 'Authentication failed',
  'AUTH_TOKEN_EXPIRED': 'Authentication token expired',
  'USER_NOT_EXISTS': 'User not exists',
  'USER_ALREADY_EXISTS': 'User already exists',
}

export const REGEX = {
  FORBIDDEN_CODE:
    /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i,
  PHONE: /^(?:(?:\+|00)92\s?|0)?3[0-9]{2}\s?[0-9]{7}$/,
  CNIC: /^\d{5}-?\d{7}-?\d{1}$/,
} as const;

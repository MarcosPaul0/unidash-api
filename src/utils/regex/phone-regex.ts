export function getPhoneRegex(): RegExp {
  return /^\+\d{1,3}\s?\(\d{2,3}\)\s?\d{4,5}-\d{4}$/gm
}

export const getReadableError = (error, fallbackMessage = 'Something went wrong') => {
  const firstValidationError = error?.response?.data?.errors?.[0]?.message;
  const responseMessage = error?.response?.data?.message;

  if (!error?.response) {
    return 'Network error. Please check your connection and try again.';
  }

  return firstValidationError || responseMessage || fallbackMessage;
};

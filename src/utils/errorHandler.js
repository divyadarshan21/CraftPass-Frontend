export const errorHandler = {
  handle: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || data?.error || 'Something went wrong';
      
      switch (status) {
        case 400:
          return { message: 'Invalid request. Please check your input.', status };
        case 401:
          return { message: 'Please log in to continue.', status };
        case 403:
          return { message: 'You don\'t have permission to do that.', status };
        case 404:
          return { message: 'Resource not found.', status };
        case 422:
          return { message: 'Validation failed. Please check your input.', status, errors: data.errors };
        case 429:
          return { message: 'Too many requests. Please try again later.', status };
        case 500:
          return { message: 'Server error. Please try again later.', status };
        default:
          return { message: message || 'An unexpected error occurred.', status };
      }
    } else if (error.request) {
      return { message: 'Network error. Please check your connection.' };
    } else {
      return { message: error.message || 'An unexpected error occurred.' };
    }
  },

  getErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    return error?.message || 'Something went wrong. Please try again.';
  },
};
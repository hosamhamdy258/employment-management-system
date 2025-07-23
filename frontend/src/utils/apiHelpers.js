/**
 * Centralized API response handling utilities
 * Eliminates repetitive error handling patterns
 */

export const handleApiResponse = (response, successMessage) => {
  return {
    success: true,
    data: response.data,
    message: successMessage,
  };
};

export const handleApiError = (error, defaultMessage) => {
  let errorMessage = defaultMessage;
  
  if (error.response?.data) {
    const data = error.response.data;
    
    // Handle validation errors (field-specific)
    if (data.detail) {
      errorMessage = data.detail;
    } else if (data.name && Array.isArray(data.name)) {
      errorMessage = data.name[0];
    } else if (data.company && Array.isArray(data.company)) {
      errorMessage = data.company[0];
    } else if (data.email && Array.isArray(data.email)) {
      errorMessage = data.email[0];
    } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
      errorMessage = data.non_field_errors[0];
    } else if (typeof data === 'string') {
      errorMessage = data;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return {
    success: false,
    error: errorMessage,
  };
};

export const createApiMethod = (apiCall, successMessage, errorMessage) => {
  return async (...args) => {
    try {
      const response = await apiCall(...args);
      return handleApiResponse(response, successMessage);
    } catch (error) {
      return handleApiError(error, errorMessage);
    }
  };
};

// Common API patterns
export const apiPatterns = {
  create: (api, endpoint, entityName) => 
    createApiMethod(
      (data) => api.post(endpoint, data),
      `${entityName} created successfully`,
      `Failed to create ${entityName.toLowerCase()}`
    ),
    
  update: (api, endpoint, entityName) =>
    createApiMethod(
      (id, data) => api.put(`${endpoint}${id}/`, data),
      `${entityName} updated successfully`,
      `Failed to update ${entityName.toLowerCase()}`
    ),
    
  delete: (api, endpoint, entityName) =>
    createApiMethod(
      (id) => api.delete(`${endpoint}${id}/`),
      `${entityName} deleted successfully`,
      `Failed to delete ${entityName.toLowerCase()}`
    ),
    
  fetchList: (api, endpoint, entityName) =>
    createApiMethod(
      (page = 1) => api.get(`${endpoint}?page=${page}`),
      `${entityName} list loaded`,
      `Failed to load ${entityName.toLowerCase()} list`
    ),
    
  fetchAll: (api, endpoint, entityName) =>
    createApiMethod(
      () => api.get(endpoint),
      `All ${entityName.toLowerCase()}s loaded`,
      `Failed to load all ${entityName.toLowerCase()}s`
    ),
};

export default {
  handleApiResponse,
  handleApiError,
  createApiMethod,
  apiPatterns,
};

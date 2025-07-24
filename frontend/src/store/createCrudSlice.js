import api from "../api/axios";
import { withToast } from "./toast";

export const createCrudSlice = (config) => (set) => {
  const { endpoint, entityName, entityNamePlural, allEndpoint } = config;

  const sliceName = entityNamePlural;

  return {
    items: [],
    allItems: [],
    count: 0,
    loading: false,
    allItemsLoading: false,
    error: "",

    viewItem: null,
    viewLoading: false,
    viewError: "",

    fetchItemById: async (id) => {
      set((state) => {
        state[sliceName].viewLoading = true;
        state[sliceName].viewError = "";
        state[sliceName].viewItem = null;
      });
      try {
        const res = await api.get(`${endpoint}${id}/`);
        set((state) => {
          state[sliceName].viewItem = res.data;
          state[sliceName].viewLoading = false;
        });
      } catch (err) {
        set((state) => {
          state[sliceName].viewError = err.response?.data?.detail || `Failed to load ${entityName}`;
          state[sliceName].viewLoading = false;
        });
      }
    },

    fetchItems: async (page = 1) => {
      set((state) => {
        state[sliceName].loading = true;
        state[sliceName].error = "";
      });
      try {
        const res = await api.get(`${endpoint}?page=${page}`);
        const { results, count } = res.data;
        set((state) => {
          state[sliceName].items = results || res.data; // Fallback for non-paginated
          state[sliceName].count = count || (Array.isArray(res.data) ? res.data.length : 0);
          state[sliceName].loading = false;
        });
      } catch (err) {
        set((state) => {
          state[sliceName].error = err.response?.data?.detail || `Failed to load ${entityNamePlural}`;
          state[sliceName].loading = false;
        });
      }
    },

    fetchAllItems: async () => {
      if (!allEndpoint) return;
      set((state) => {
        state[sliceName].allItemsLoading = true;
      });
      try {
        const res = await api.get(allEndpoint);
        set((state) => {
          state[sliceName].allItems = res.data;
          state[sliceName].allItemsLoading = false;
        });
      } catch (err) {
        set((state) => {
          state[sliceName].error = err.response?.data?.detail || `Failed to load all ${entityNamePlural}`;
          state[sliceName].allItemsLoading = false;
        });
      }
    },

    addItem: async (data) => {
      const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
      try {
        return await withToast(
          async () => {
            const res = await api.post(endpoint, data);
            return { success: true, data: res.data };
          },
          {
            success: `${capitalizedEntity} added successfully!`,
            error: `Failed to add ${entityName}.`,
          }
        );
      } catch (err) {
        const data_1 = err.response?.data || {};
        let errorMsg = data_1.non_field_errors?.[0] ||
          data_1.detail ||
          data_1.name?.[0] ||
          data_1.company?.[0] ||
          `Failed to add ${entityName}.`;
        if (data_1.non_field_errors) {
          return { success: false, error: errorMsg, fieldErrors: { non_field_errors: data_1.non_field_errors } };
        }
        return { success: false, error: errorMsg };
      }
    },

    updateItem: async (id, data) => {
      const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
      try {
        return await withToast(
          async () => {
            const res = await api.put(`${endpoint}${id}/`, data);
            set((state) => {
              const itemIndex = state[sliceName].items.findIndex((item) => item.id === id);
              if (itemIndex !== -1) {
                state[sliceName].items[itemIndex] = res.data;
              }
            });
            return { success: true, data: res.data };
          },
          {
            success: `${capitalizedEntity} updated successfully!`,
            error: `Failed to update ${entityName}.`,
          }
        );
      } catch (err) {
        const data_1 = err.response?.data || {};
        let errorMsg = data_1.non_field_errors?.[0] ||
          data_1.detail ||
          data_1.name?.[0] ||
          data_1.company?.[0] ||
          `Failed to update ${entityName}.`;
        if (data_1.non_field_errors) {
          return { success: false, error: errorMsg, fieldErrors: { non_field_errors: data_1.non_field_errors } };
        }
        return { success: false, error: errorMsg };
      }
    },

    deleteItem: async (id) => {
      const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
      try {
        return await withToast(
          async () => {
            await api.delete(`${endpoint}${id}/`);
            return { success: true };
          },
          {
            success: `${capitalizedEntity} deleted successfully!`,
            error: `Failed to delete ${entityName}.`,
          }
        );
      } catch (err) {
        const errorMsg = err.response?.data?.detail || `Failed to delete ${entityName}.`;
        return { success: false, error: errorMsg };
      }
    },
  };
};

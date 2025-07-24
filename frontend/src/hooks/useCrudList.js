import { useState, useEffect } from 'react';
import useStore from '../store/store';

const PAGE_SIZE = 10;

/**
 * Generic hook for CRUD list operations
 * Eliminates repetitive state management and handlers across list components
 */
export const useCrudList = ({
  entityName,
  entityNamePlural,
  initialFormData = {},
  onFormDataTransform = (data) => data, // Transform data before editing
}) => {
  // Select state and actions from the store
  const {
    items,
    count,
    loading,
    error,
    viewItem,
    viewLoading,
    viewError,
    fetchItems,
    deleteItem,
    addItem,
    updateItem,
    fetchItemById,
  } = useStore((state) => state[entityNamePlural]);

  const [currentPage, setCurrentPage] = useState(1);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Form modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage, fetchItems]);

  // Delete handlers
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteError(null); // Clear previous errors
    setShowDeleteModal(true);
  };


  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
    setDeleteError(null); // Clear error on close
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    const result = await deleteItem(selectedItem.id);
    if (result.success) {
      handleCloseDeleteModal();
      // Handle pagination after delete
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchItems(currentPage);
      }
    } else {
      setDeleteError(result.error || `Failed to delete ${entityName.toLowerCase()}.`);
    }
    setDeleteLoading(false);
  };

  // Form handlers
  const handleAddClick = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setFormError('');
    setShowFormModal(true);
  };

  const handleEditClick = (item) => {
    const transformedData = onFormDataTransform(item);
    setEditingItem(item);
    setFormData(transformedData);
    setFormError('');
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingItem(null);
    setFormData(null);
    setFormError('');
  };

  const handleFormSubmit = async (validatedData) => {
    setFormLoading(true);
    setFormError('');
    const result = editingItem
      ? await updateItem(editingItem.id, validatedData)
      : await addItem(validatedData);

    if (result.success) {
      handleCloseFormModal();
      fetchItems(currentPage);
    } else {
      // Support field-level backend error mapping
      if (result.fieldErrors && typeof result.fieldErrors === 'object') {
        setFormError(result.fieldErrors);
      } else {
        setFormError(result.error || `Failed to ${editingItem ? 'update' : 'add'} ${entityName.toLowerCase()}.`);
      }
    }
    setFormLoading(false);
  };

  // View modal handlers
  const handleShowViewModal = (id) => {
    setShowViewModal(true);
    fetchItemById(id);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return {
    // Data
    items,
    count,
    loading,
    error,
    currentPage,
    totalPages,
    
    // Delete modal
    showDeleteModal,
    selectedItem,
    deleteLoading,
    deleteError,
    handleDeleteClick,
    handleCloseDeleteModal,
    handleConfirmDelete,
    
    // Form modal
    showFormModal,
    editingItem,
    formData,
    formLoading,
    formError,
    handleAddClick,
    handleEditClick,
    handleCloseFormModal,
    handleFormSubmit,

    // View modal
    showViewModal,
    viewItem,
    viewLoading,
    viewError,
    handleShowViewModal,
    handleCloseViewModal,
    
    // Pagination
    handlePageChange,
  };
};

export default useCrudList;

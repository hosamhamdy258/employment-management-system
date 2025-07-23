import EntityList from "./EntityList";
import ConfirmModal from "./ConfirmModal";
import EntityFormModal from "./EntityFormModal";
import Pagination from "./Pagination";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useCrudList } from "../hooks/useCrudList";
import useAuthStore from "../store/auth";

/**
 * Generic list page component that eliminates repetitive CRUD UI patterns
 * Used by CompanyList, DepartmentList, and EmployeeList
 */

const GenericListPage = ({
  title,
  entityName,
  entityNamePlural,
  columns,
  formFields,
  initialFormData = {},
  onFormDataTransform,
  onDataTransformForDisplay, // Transform data for display (e.g., status values to labels)
  validationSchema,
}) => {
  const user = useAuthStore((s) => s.user);
  const { 
    items, count, loading, error, currentPage, totalPages,
    showDeleteModal, selectedItem, deleteLoading, handleDeleteClick, handleCloseDeleteModal, handleConfirmDelete,
    showFormModal, editingItem, formData, formLoading, formError, handleAddClick, handleEditClick, handleCloseFormModal, handleFormSubmit,
    handlePageChange 
  } = useCrudList({
    entityName,
    entityNamePlural,
    initialFormData,
    onFormDataTransform,
  });



  // Create wrapper functions to ensure original data is passed to handlers
  const handleEditClickWrapper = (displayItem) => {
    // Find the original item by ID to ensure we pass untransformed data
    const originalItem =
      items.find((item) => item.id === displayItem.id) || displayItem;
    handleEditClick(originalItem);
  };

  const handleDeleteClickWrapper = (displayItem) => {
    // Find the original item by ID to ensure we pass untransformed data
    const originalItem =
      items.find((item) => item.id === displayItem.id) || displayItem;
    handleDeleteClick(originalItem);
  };

  // Only allow edit/delete for ADMIN or MANAGER
  const actions = [
    {
      label: "Edit",
      variant: "primary",
      icon: <Pencil className="me-2" />,
      onClick: handleEditClickWrapper,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      label: "Delete",
      variant: "danger",
      icon: <Trash className="me-2" />,
      onClick: handleDeleteClickWrapper,
      roles: ["ADMIN", "MANAGER"],
    },
  ]

  // Transform data for display if a transformation function is provided
  const displayData = onDataTransformForDisplay ? onDataTransformForDisplay(items) : items;

  // Determine if the current user has elevated privileges
  const hasElevatedPrivileges = user && ["ADMIN", "MANAGER"].includes(user.role);

  return (
    <>
      <EntityList
        title={title}
        columns={columns}
        data={displayData}
        loading={loading}
        error={error}
        actions={hasElevatedPrivileges ? actions : []}
        userRole={user?.role} // Pass role to EntityList for internal filtering
        addLabel={hasElevatedPrivileges ? `Add ${entityName}` : null}
        onAdd={hasElevatedPrivileges ? handleAddClick : null}
        totalCount={count}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          show={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          title="Confirm Deletion"
          loading={deleteLoading}
        >
          Are you sure you want to delete the {entityName.toLowerCase()} "
          <strong>{selectedItem?.name}</strong>"?
        </ConfirmModal>
      )}

      {showFormModal && (
        <EntityFormModal
          show={showFormModal}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          title={editingItem ? `Edit ${entityName}` : `Add ${entityName}`}
          fields={formData?._formFields || formFields}
          formData={formData}
          loading={formLoading}
          error={formError}
          submitLabel={editingItem ? "Update" : "Add"}
          validationSchema={validationSchema}
        />
      )}
    </>
  );
};

export default GenericListPage;

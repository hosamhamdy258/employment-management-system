import React from "react";
import { PlusCircle, ExclamationTriangleFill, XCircleFill } from 'react-bootstrap-icons';

export default function EntityList({
  columns = [],
  data = [],
  actions = [],
  loading = false,
  error = "",
  title = "",
  addLabel = "Add",
  onAdd,
  totalCount = 0,
}) {

  return (
    <>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1">{title}</h1>
          <p className="text-muted mb-0">Manage your {title.toLowerCase()} efficiently</p>
        </div>
        {onAdd && (
          <button className="btn btn-outline-success" onClick={onAdd}>
            <PlusCircle className="me-2" />
            {addLabel}
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <ExclamationTriangleFill className="me-2" />
          <div>{error}</div>
        </div>
      )}

      {/* Data Card */}
      <div className="card shadow">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.field} className="fw-semibold py-3 px-4 border-secondary">
                      {col.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="fw-semibold py-3 px-4 border-secondary text-center">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center py-5">
                      <div className="d-flex flex-column align-items-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mb-0">Loading data...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-5">
                      <XCircleFill className="display-6 text-muted mb-3" />
                      <h5 className="fw-bold">No Data Found</h5>
                      <p className="text-muted">There are no records to display at the moment.</p>
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id}>
                      {columns.map((col) => (
                        <td key={col.field} className="py-3 px-4 border-secondary">
                          <div className="fw-medium">
                            {col.render
                              ? col.render(row[col.field], row)
                              : row[col.field] || '-'}
                          </div>
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="py-3 px-4 border-secondary">
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            {actions.map((action, i) => (
                              <button
                                key={i}
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => action.onClick(row)}
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      {!loading && data.length > 0 && (
        <div className="mt-3 text-muted small">
          Showing {data.length} of {totalCount} {totalCount === 1 ? 'record' : 'records'}
        </div>
      )}
    </>
  );
}

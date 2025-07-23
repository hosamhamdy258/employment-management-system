import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createCrudSlice } from "./createCrudSlice";

const useStore = create(immer((set, get) => ({
  companies: {
    ...createCrudSlice({
      endpoint: "/api/companies/",
      allEndpoint: "/api/companies/all/",
      entityName: "company",
      entityNamePlural: "companies",
    })(set, get),
  },
  departments: {
    ...createCrudSlice({
      endpoint: "/api/departments/",
      allEndpoint: "/api/departments/all/",
      entityName: "department",
      entityNamePlural: "departments",
    })(set, get),
  },
  employees: {
    ...createCrudSlice({
      endpoint: "/api/employees/",
      entityName: "employee",
      entityNamePlural: "employees",
    })(set, get),
  },
})));

export default useStore;

/**
 * Centralized form validation utilities
 * Eliminates repetitive validation logic across components
 */



import { z } from "zod";

// Zod schemas for each entity
export const companySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Max 100 characters"),
});

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(100, "Max 100 characters"),
  company: z.union([z.string().min(1, "Company is required"), z.number()]),
});

// Employee validation: strong rules for all fields
export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "Employee name is required")
    .max(100, "Max 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Max 254 characters"),
  // Mobile: must be E.164 format (starts with +, 10-15 digits), or blank
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .refine((val) => /^\+?[1-9]\d{9,14}$/.test(val), {
      message:
        "Please enter a valid mobile number (E.164 format, 10-15 digits, optional +).",
    }),
  address: z.string()
    .min(1, "Address is required")
    .max(255, "Max 255 characters"),
  company: z.union([z.string().min(1, "Company is required"), z.number()]),
  department: z.union([
    z.string().min(1, "Department is required"),
    z.number(),
  ]),
  designation: z.string().min(1, "Designation is required"),
  status: z.union([z.string().min(1, "Status is required"), z.string()]),
});

export default {
  companySchema,
  departmentSchema,
  employeeSchema,
};

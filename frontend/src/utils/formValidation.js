/**
 * Centralized form validation utilities
 * Eliminates repetitive validation logic across components
 */


import { z } from "zod";

// Validation Constants from backend
const NAME_MAX_LENGTH = 255;
const DESIGNATION_MAX_LENGTH = 255;
const MOBILE_MAX_LENGTH = 30;
const EMAIL_MAX_LENGTH = 254;
const ADDRESS_MAX_LENGTH = 255;

// Zod schemas for each entity
export const companySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(NAME_MAX_LENGTH, `Max ${NAME_MAX_LENGTH} characters`),
});

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(NAME_MAX_LENGTH, `Max ${NAME_MAX_LENGTH} characters`),
  company: z.union([z.string().min(1, "Company is required"), z.number()]),
});

// Employee validation: strong rules for all fields
export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "Employee name is required")
    .max(NAME_MAX_LENGTH, `Max ${NAME_MAX_LENGTH} characters`),
  email: z
    .string()
    .email("Invalid email address")
    .max(EMAIL_MAX_LENGTH, `Max ${EMAIL_MAX_LENGTH} characters`),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .max(MOBILE_MAX_LENGTH, `Max ${MOBILE_MAX_LENGTH} characters`)
    .refine((val) => /^\+?[1-9]\d{9,14}$/.test(val), {
      message:
        "Please enter a valid mobile number (E.164 format, 10-15 digits, optional +).",
    }),
  address: z.string()
    .max(ADDRESS_MAX_LENGTH, `Max ${ADDRESS_MAX_LENGTH} characters`)
    .optional()
    .or(z.literal('')), // Allows empty string
  designation: z.string()
    .min(1, "Designation is required")
    .max(DESIGNATION_MAX_LENGTH, `Max ${DESIGNATION_MAX_LENGTH} characters`),
  company: z.union([z.string().min(1, "Company is required"), z.number()]),
  department: z.union([
    z.string().min(1, "Department is required"),
    z.number(),
  ]),
  status: z.enum([
    "APPLICATION_RECEIVED",
    "INTERVIEW_SCHEDULED",
    "HIRED",
    "NOT_ACCEPTED",
  ]),
  hired_on: z.string().optional().or(z.literal('')), // Handled as optional string
});

export default {
  companySchema,
  departmentSchema,
  employeeSchema,
};

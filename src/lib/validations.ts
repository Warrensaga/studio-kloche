import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(9, "Please enter a valid phone number (at least 9 digits)"),
  email: z.string().email("Please enter a valid email address").or(z.literal("")).or(z.null()).optional(),
  service: z.string().min(1, "Please select an interior service"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(9, "Please enter a valid phone number"),
  email: z.string().email("Invalid email").or(z.literal("")).or(z.null()).optional(),
  address: z.string().or(z.literal("")).or(z.null()).optional(),
  notes: z.string().or(z.literal("")).or(z.null()).optional(),
  status: z.enum(["lead", "active", "completed"]).default("lead"),
});

export const appointmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  phone: z.string().min(9, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select an interior service"),
  date: z.string().min(1, "Please specify appointment date & time")
    .or(z.date()),
  duration: z.coerce.number().int().positive().default(60),
  status: z.enum(["confirmed", "cancelled", "completed"]).default("confirmed"),
  notes: z.string().or(z.literal("")).or(z.null()).optional(),
  clientId: z.string().or(z.literal("")).or(z.null()).optional(),
});

export type EnquiryFormInput = z.infer<typeof enquirySchema>;
export type ClientFormInput = z.infer<typeof clientSchema>;
export type AppointmentFormInput = z.infer<typeof appointmentSchema>;

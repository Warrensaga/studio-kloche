import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader } from "lucide-react";
import { clientSchema, ClientFormInput } from "../../lib/validations";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormInput) => Promise<void>;
  initialData?: any;
}

export default function ClientForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      status: "lead",
    },
  });

  // Re-populate form when initialData changes (e.g. for edits)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        notes: initialData.notes || "",
        status: initialData.status || "lead",
      });
    } else {
      reset({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
        status: "lead",
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Dark overlay backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/65 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide over Container */}
      <div className="relative w-full max-w-lg bg-[#FAF8F4] h-full shadow-2xl flex flex-col justify-between border-l border-gold/15 z-10 transition-transform duration-300 transform translate-x-0 overflow-y-auto">
        
        {/* Header toolbar */}
        <div className="p-6 border-b border-[#E2DDD5] flex justify-between items-center bg-[#F5F0E8]/55">
          <div>
            <h3 className="font-serif text-xl font-medium text-charcoal">
              {initialData ? "Edit Client Profile" : "Register New Client"}
            </h3>
            <p className="text-[11px] text-muted tracking-wider uppercase">Lead Management System</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[#E2DDD5] hover:border-gold-light hover:text-gold text-charcoal transition-colors bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form panel body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5 flex-1 text-left">
          {/* Client Name */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1.5">
              Client Name <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Amanda Kimani"
              className="bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
            />
            {errors.name?.message && (
              <span className="text-red-500 text-xs mt-1.5 font-light">{String(errors.name.message)}</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1.5">
              Phone Number <span className="text-gold">*</span>
            </label>
            <input
              type="tel"
              {...register("phone")}
              placeholder="e.g. 0717 634003"
              className="bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
            />
            {errors.phone?.message && (
              <span className="text-red-500 text-xs mt-1.5 font-light">{String(errors.phone.message)}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="e.g. client@gmail.com"
              className="bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
            />
            {errors.email?.message && (
              <span className="text-red-500 text-xs mt-1.5 font-light">{String(errors.email.message)}</span>
            )}
          </div>

          {/* Physical Address */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1.5">
              Physical Address
            </label>
            <input
              type="text"
              {...register("address")}
              placeholder="e.g. Kilimani Penthouse, Nairobi"
              className="bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Project Status */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1.5">
              Status Flag <span className="text-gold">*</span>
            </label>
            <select
              {...register("status")}
              className="bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="lead">Lead File (Amber)</option>
              <option value="active">Active Renovation (Blue)</option>
              <option value="completed">Completed Design (Green)</option>
            </select>
          </div>

          {/* Notes summary */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1.5">
              Studio Notes & Walkthrough History
            </label>
            <textarea
              rows={4}
              {...register("notes")}
              placeholder="Record spatial walkthrough dimensions, furniture budgets, timeline milestones, or bespoke curation choices."
              className="bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-gold resize-none"
            />
          </div>
        </form>

        {/* Sticky footer action buttons */}
        <div className="p-6 border-t border-[#E2DDD5] bg-[#F5F0E8]/40 flex space-x-3">
          <button
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 bg-charcoal text-warm-white hover:bg-gold transition-colors text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin text-gold" /> Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 border border-[#E2DDD5] hover:bg-charcoal/5 hover:text-charcoal transition-colors text-xs font-semibold text-muted uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

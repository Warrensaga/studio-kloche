import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader, Trash2, Calendar } from "lucide-react";
import { appointmentSchema, AppointmentFormInput } from "../../lib/validations";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  initialData?: any;
  clientsList?: any[]; // For link dropdown
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  clientsList = [],
}: AppointmentModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const servicesList = [
    "Interior Design",
    "Renovation",
    "Short Let Styling",
    "Office Design",
    "Space Planning",
    "Furniture & Decor",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: "",
      clientName: "",
      phone: "",
      service: "",
      date: "",
      duration: 60,
      status: "confirmed",
      notes: "",
      clientId: "",
    },
  });

  // Watch Client select dropdown to auto-fill name/phone if linked
  const selectedClientId = watch("clientId");

  useEffect(() => {
    if (selectedClientId && selectedClientId !== "") {
      const match = clientsList.find((c) => c.id === selectedClientId);
      if (match) {
        setValue("clientName", match.name);
        setValue("phone", match.phone);
        setValue("title", `${match.name} - Studio Consultation`);
      }
    }
  }, [selectedClientId, clientsList, setValue]);

  // Handle re-population
  useEffect(() => {
    if (initialData) {
      // Date formatting for datetime-local
      let formattedDate = "";
      if (initialData.date) {
        const rawDate = new Date(initialData.date);
        // Convert to local ISO format: YYYY-MM-DDTHH:MM
        const offset = rawDate.getTimezoneOffset();
        const adjustedDate = new Date(rawDate.getTime() - offset * 60 * 1000);
        formattedDate = adjustedDate.toISOString().slice(0, 16);
      }

      reset({
        title: initialData.appointmentTitle || initialData.title || "",
        clientName: initialData.clientName || "",
        phone: initialData.phone || "",
        service: initialData.service || "",
        date: formattedDate,
        duration: initialData.duration || 60,
        status: initialData.status || "confirmed",
        notes: initialData.notes || "",
        clientId: initialData.clientId || "",
      });
    } else {
      reset({
        title: "",
        clientName: "",
        phone: "",
        service: "",
        date: "",
        duration: 60,
        status: "confirmed",
        notes: "",
        clientId: "",
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(initialData.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
      <div
        className="absolute inset-0 bg-charcoal/65 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog box body */}
      <div className="relative bg-[#FAF8F4] max-w-lg w-full mx-6 border border-gold/15 shadow-2x flex flex-col max-h-[90vh] z-10 transition-transform duration-300">
        
        {/* Header toolbar */}
        <div className="p-5 border-b border-[#E2DDD5] flex justify-between items-center bg-[#F5F0E8]/50">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg font-medium text-charcoal">
              {initialData ? "Edit Studio Appointment" : "Arrange New Appointment"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#E2DDD5] text-charcoal hover:text-gold hover:border-gold-light bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body layout scrollable */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1 text-left scrollbar-thin">
          
          {/* Link existing CRM user */}
          <div className="flex flex-col bg-zinc-100/50 border border-gold/5 p-4 rounded-none space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-semibold text-[#6B6560]">
              Link Existing Client File? <span className="text-xs text-muted/60 lowercase italic">(optional)</span>
            </label>
            <select
              {...register("clientId")}
              className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-xs focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="">-- Fresh New Walk-in Lead --</option>
              {clientsList.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Schedule Title */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
              Appointment Subject / Title <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. Amanda Kimani - Blueprints Walkthrough"
              className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-sm focus:outline-none focus:border-gold"
            />
            {errors.title?.message && (
              <span className="text-red-500 text-xs mt-1 font-light">{String(errors.title.message)}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Name input */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
                Client Name <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                {...register("clientName")}
                placeholder="Amanda Kimani"
                className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-sm focus:outline-none focus:border-gold"
              />
              {errors.clientName?.message && (
                <span className="text-red-500 text-xs mt-1 font-light">{String(errors.clientName.message)}</span>
              )}
            </div>

            {/* Phone input */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
                Phone Number <span className="text-gold">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="0717 634003"
                className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-sm focus:outline-none focus:border-gold"
              />
              {errors.phone?.message && (
                <span className="text-red-500 text-xs mt-1 font-light">{String(errors.phone.message)}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Service dropdown */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
                Design Service <span className="text-gold">*</span>
              </label>
              <select
                {...register("service")}
                className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-sm focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="">-- Choose Option --</option>
                {servicesList.map((svc) => (
                  <option key={svc} value={svc}>
                    {svc}
                  </option>
                ))}
              </select>
              {errors.service?.message && (
                <span className="text-red-500 text-xs mt-1 font-light">{String(errors.service.message)}</span>
              )}
            </div>

            {/* Status indicators */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
                Booking Status <span className="text-gold">*</span>
              </label>
              <select
                {...register("status")}
                className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-sm focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="confirmed">Confirmed (Gold)</option>
                <option value="cancelled">Cancelled (Muted Gray)</option>
                <option value="completed">Completed (Emerald)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date local input */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
                Date & Time <span className="text-gold">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("date")}
                className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-sm focus:outline-none focus:border-gold"
              />
              {errors.date?.message && (
                <span className="text-red-500 text-xs mt-1 font-light">{String(errors.date.message)}</span>
              )}
            </div>

            {/* Duration minutes select */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
                Duration <span className="text-gold">*</span>
              </label>
              <select
                {...register("duration")}
                className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-sm focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="90">1.5 Hours</option>
                <option value="120">2 Hours</option>
              </select>
            </div>
          </div>

          {/* Notes description textarea */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-1">
              Private Schedule Notes
            </label>
            <textarea
              rows={3}
              {...register("notes")}
              placeholder="Record any special moodboard elements, floor plan dimensions, or layout options discussed during the consultation."
              className="bg-white border border-[#E2DDD5] px-3.5 py-2 text-xs focus:outline-none focus:border-gold resize-none"
            />
          </div>
        </form>

        {/* Action button footers */}
        <div className="p-5 border-t border-[#E2DDD5] bg-[#F5F0E8]/40 flex space-x-3 items-center">
          {initialData && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-3 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 bg-white transition-colors"
              title="Delete Booking Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSaving}
            className="flex-1 py-3 px-5 bg-charcoal text-warm-white hover:bg-gold transition-colors text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin text-gold" /> Saving...
              </>
            ) : (
              "Save Event"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 border border-[#E2DDD5] hover:bg-charcoal/5 hover:text-charcoal text-xs font-semibold text-muted uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

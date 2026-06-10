import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Phone, Mail, MapPin, Clock, ArrowRight, Loader } from "lucide-react";
import { enquirySchema, EnquiryFormInput } from "../../lib/validations";
import { useState } from "react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const servicesList = [
    "Residential Interior Design",
    "Commercial Interior Design",
    "Space Planning",
    "Furniture & Decor Selection",
    "Renovation Consultation",
    "Custom Design Solutions"
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: EnquiryFormInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to upload lead metadata");
      }

      await response.json();
      toast.success("Enquiry logged and notification sent!");

      // Open WhatsApp pre-filled message with details in a new tab
      const cleanPhone = "+254717634003";
      const messageText = `Hello Kloche Interiors! My name is ${data.name}. I've just submitted an enquiry on your website regarding "${data.service}". My phone is ${data.phone}. Here's my project brief: "${data.message}"`;
      const whatsappUrl = `https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(messageText)}`;
      
      window.open(whatsappUrl, "_blank");

      reset();
    } catch (err: any) {
      console.error(err);
      toast.error("Form logged locally, but email server is unresponsive.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#F5F0E8] relative border-t border-kloche-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Studio info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-kloche-green font-semibold mb-3 block animate-pulse-gold">
                Get In Touch
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight animate-fade-up">
                Connect with <span className="font-serif italic text-kloche-green font-normal">Our Studio</span>
              </h2>
              <p className="font-sans font-light text-sm text-muted mt-4 leading-relaxed">
                Describe your commercial design, home remodeling, or short let layout ideas. Our studio handles concept design through complete physical fit-outs.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Card Address */}
              <div className="flex items-start space-x-4 bg-[#F5F0E8]/40 border border-kloche-green/10 p-5 rounded-none shadow-xs">
                <MapPin className="w-5 h-5 text-kloche-green mt-1 flex-shrink-0" />
                <div className="text-left font-sans text-sm">
                  <h4 className="font-medium text-charcoal tracking-wider uppercase text-xs mb-1">Our Location</h4>
                  <p className="text-muted font-light">Karuna Rd, Westlands</p>
                  <p className="text-muted font-light">Nairobi, Kenya</p>
                </div>
              </div>

              {/* Card Phone */}
              <div className="flex items-start space-x-4 bg-[#F5F0E8]/40 border border-kloche-green/10 p-5 rounded-none shadow-xs">
                <Phone className="w-5 h-5 text-kloche-green mt-1 flex-shrink-0" />
                <div className="text-left font-sans text-sm">
                  <h4 className="font-medium text-charcoal tracking-wider uppercase text-xs mb-1">Call / WhatsApp</h4>
                  <p className="text-muted font-light">
                    <a href="tel:+254717634003" className="hover:text-kloche-green transition-colors block">
                      0717 634003
                    </a>
                  </p>
                  <p className="text-kloche-green font-medium text-xs mt-0.5">● Online (Available 8am – 5pm)</p>
                </div>
              </div>

              {/* Card Hours */}
              <div className="flex items-start space-x-4 bg-[#F5F0E8]/40 border border-kloche-green/10 p-5 rounded-none shadow-xs">
                <Clock className="w-5 h-5 text-kloche-green mt-1 flex-shrink-0" />
                <div className="text-left font-sans text-sm">
                  <h4 className="font-medium text-charcoal tracking-wider uppercase text-xs mb-1">Studio Hours</h4>
                  <p className="text-muted font-light">Monday – Saturday: 8:00 AM – 5:00 PM</p>
                  <p className="text-xs text-muted/50 font-light">Sundays: Closed</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="font-sans text-xs tracking-widest text-kloche-green font-bold uppercase mb-3">Our Social Networks</p>
              <div className="flex space-x-3 text-xs uppercase font-medium">
                <a href="https://www.instagram.com/klocheinteriors" target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 border border-kloche-green/20 hover:border-kloche-gold hover:text-kloche-gold transition-all duration-300">Instagram</a>
                <a href="https://www.tiktok.com/@klocheinteriors" target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 border border-kloche-green/20 hover:border-kloche-gold hover:text-kloche-gold transition-all duration-300">TikTok</a>
                <a href="https://www.linkedin.com/company/klocheinteriors" target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 border border-kloche-green/20 hover:border-kloche-gold hover:text-kloche-gold transition-all duration-300">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-[#F5F0E8]/30 border border-kloche-green/10 p-8 md:p-10 shadow-xs">
            <h3 className="font-serif text-2xl font-light text-charcoal tracking-wide mb-6">
              Send an <span className="italic text-kloche-green font-normal">Enquiry Form</span>
            </h3>

            <form id="contact-interior-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Field Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full name */}
                <div className="flex flex-col text-left font-sans">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-medium text-charcoal mb-2">
                    Full Name <span className="text-kloche-green">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    placeholder="e.g. Amanda Kimani"
                    className="bg-[#FAF8F4] border border-[#E2DDD5] px-4 py-3.5 text-sm focus:outline-none focus:border-kloche-green transition-colors"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1.5 font-light">{errors.name.message}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col text-left font-sans">
                  <label htmlFor="phone" className="text-xs uppercase tracking-widest font-medium text-charcoal mb-2">
                    Phone Number <span className="text-kloche-green">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="e.g. 0717 634003"
                    className="bg-[#FAF8F4] border border-[#E2DDD5] px-4 py-3.5 text-sm focus:outline-none focus:border-kloche-green transition-colors"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs mt-1.5 font-light">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              {/* Email / Service Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email (Optional) */}
                <div className="flex flex-col text-left font-sans">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-medium text-charcoal mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="e.g. client@domain.com"
                    className="bg-[#FAF8F4] border border-[#E2DDD5] px-4 py-3.5 text-sm focus:outline-none focus:border-kloche-green transition-colors"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1.5 font-light">{errors.email.message}</span>
                  )}
                </div>

                {/* Service Dropdown */}
                <div className="flex flex-col text-left font-sans">
                  <label htmlFor="service" className="text-xs uppercase tracking-widest font-medium text-charcoal mb-2">
                    Select Service <span className="text-kloche-green">*</span>
                  </label>
                  <select
                    id="service"
                    {...register("service")}
                    className="bg-[#FAF8F4] border border-[#E2DDD5] px-4 py-3.5 text-sm focus:outline-none focus:border-kloche-green cursor-pointer transition-colors"
                  >
                    <option value="">-- Choose Option --</option>
                    {servicesList.map((svc) => (
                      <option key={svc} value={svc}>
                        {svc}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <span className="text-red-500 text-xs mt-1.5 font-light">{errors.service.message}</span>
                  )}
                </div>
              </div>

              {/* Description message box */}
              <div className="flex flex-col text-left font-sans">
                <label htmlFor="message" className="text-xs uppercase tracking-widest font-medium text-charcoal mb-2">
                  Project Message / Brief <span className="text-kloche-green">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  placeholder="Tell us about your space. Do you need concept blueprints, custom remodelling, materials sourcing, or a specific handover date?"
                  className="bg-[#FAF8F4] border border-[#E2DDD5] px-4 py-3.5 text-sm focus:outline-none focus:border-kloche-green transition-colors resize-none"
                />
                {errors.message && (
                  <span className="text-red-500 text-xs mt-1.5 font-light">{errors.message.message}</span>
                )}
              </div>

              {/* Submit Buttons */}
              <button
                id="contact-form-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 border border-kloche-green text-[#FAF8F4] bg-kloche-green hover:bg-kloche-gold hover:border-kloche-gold hover:text-[#1F1C1B] transition-all duration-300 tracking-widest text-xs uppercase font-semibold flex items-center justify-center gap-2 rounded-xs shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-kloche-gold" /> Connecting...
                  </>
                ) : (
                  <>
                    Submit & Connect on WhatsApp <ArrowRight className="w-4 h-4 text-kloche-gold animate-bounce" />
                  </>
                )}
              </button>

              <p className="font-sans text-[10px] text-center text-muted/60 mt-2">
                * Clicking submit logs your details to our studio lead management engine and immediately forwards you to WhatsApp chat for instant discussion.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

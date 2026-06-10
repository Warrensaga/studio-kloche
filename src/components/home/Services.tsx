import { motion } from "motion/react";
import { Paintbrush, Hammer, Home, Briefcase, LayoutGrid, Sofa } from "lucide-react";

export default function Services() {
  const servicesData = [
    {
      num: "01",
      title: "Residential Interior Design",
      desc: "Complete layout design and materials curation for upscale private residences. We orchestrate architectural elements, custom joinery, lighting plan layouts, and bespoke surface selections from the ground up.",
      icon: Paintbrush,
    },
    {
      num: "02",
      title: "Commercial Interior Design",
      desc: "Bespoke identity-driven layouts for boutique commercial suites, retail spaces, and creative workspaces. We optimize practical workflow configurations without compromising sophisticated aesthetic presence.",
      icon: Briefcase,
    },
    {
      num: "03",
      title: "Space Planning",
      desc: "Comprehensive study of volume, footprint usage, and walking coordinates. We refine spatial circulation patterns, analyze sightlines, and establish correct scale relationships.",
      icon: LayoutGrid,
    },
    {
      num: "04",
      title: "Furniture & Decor Selection",
      desc: "Curated sourcing of physical artisan furniture, customized upholstery textiles, luxury floor coverings, and styling ornaments. We arrange items to form cohesive dimensional depth.",
      icon: Sofa,
    },
    {
      num: "05",
      title: "Renovation Consultation",
      desc: "Detailed forensic assessment of older building volumes. We deliver full physical structural restructuring, wall removal guidance, material replacement logs, and progress coordination.",
      icon: Hammer,
    },
    {
      num: "06",
      title: "Custom Design Solutions",
      desc: "Tailored architectural solutions including custom fireplace mantels, wood slatted panels, recessed indirect display niches, and bespoke cabinetry crafted to your specific life requirements.",
      icon: Home,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="services" className="py-24 bg-[#F5F0E8] relative border-t border-kloche-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-kloche-green font-bold mb-3 block">
              Bespoke Expertise
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              Our Services <span className="font-serif italic text-kloche-green font-normal">and Solutions</span>
            </h2>
          </div>
          <p className="font-sans font-light text-sm text-muted max-w-md mt-4 md:mt-0 leading-relaxed">
            From styling residential rooms to managing high-profile office renovations, Kloche Interiors delivers pristine craftsmanship at every milestone.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          id="services-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesData.map((svc) => {
            const IconComponent = svc.icon;
            
            return (
              <motion.div
                key={svc.num}
                variants={cardVariants}
                className="group relative bg-[#F5F0E8]/40 hover:bg-[#1C1C1A] px-8 py-10 border border-[#E2DDD5]/60 hover:border-charcoal transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col justify-between min-h-[300px]"
              >
                {/* Number / Icon top bar */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-3xl font-light text-kloche-gold tracking-widest transition-colors duration-500">
                    {svc.num}
                  </span>
                  <div className="w-10 h-10 border border-[#E2DDD5] group-hover:border-kloche-gold/30 rounded-none flex items-center justify-center text-kloche-green transition-all duration-500 bg-white group-hover:bg-[#1C1C1A]">
                    <IconComponent className="w-5 h-5 group-hover:text-kloche-gold group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex-1 flex flex-col justify-end">
                  <h3 className="font-serif text-2xl font-light text-charcoal group-hover:text-warm-white tracking-wide mb-3 transition-colors duration-500">
                    {svc.title}
                  </h3>
                  <p className="font-sans font-light text-sm text-muted group-hover:text-[#FAF8F4]/70 leading-relaxed transition-colors duration-500">
                    {svc.desc}
                  </p>
                </div>

                {/* Micro Animated Accent Underline */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-kloche-gold group-hover:w-full transition-all duration-500" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick CTA Desk link */}
        <div className="text-center mt-16 md:mt-20">
          <p className="font-sans text-sm text-muted">
            Have a custom property or design scope?{" "}
            <a
              href="#contact"
              className="text-kloche-green font-bold border-b border-kloche-green hover:text-kloche-gold hover:border-kloche-gold transition-colors duration-300 pb-0.5 tracking-wider uppercase text-xs pl-1"
            >
              Consult Our Studio
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

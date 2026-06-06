import { motion } from "motion/react";
import { Search, Palette, Compass, Hammer, Sparkles } from "lucide-react";

export default function Process() {
  const steps = [
    {
      num: "01",
      title: "Discovery",
      subtitle: "Site Audit & Briefing",
      desc: "Our journey begins on-site in Nairobi. We perform detailed spatial dimension scans, capture lighting coordinates, and establish your budget, milestones, and physical life expectations.",
      icon: Search,
    },
    {
      num: "02",
      title: "Concept Development",
      subtitle: "Moodboards & Volumes",
      desc: "We shape raw ideas into direction boards, curating physical stone swatches, timber specimens, and volumetric sketches to establish a grounded, cohesive mood landscape.",
      icon: Palette,
    },
    {
      num: "03",
      title: "Design Presentation",
      subtitle: "Blueprints & Scale Models",
      desc: "We deliver full architectural floorplans, customized section layouts, and high-fidelity specifications, detailing how every physical fitting aligns with the home’s flow.",
      icon: Compass,
    },
    {
      num: "04",
      title: "Implementation",
      subtitle: "Artisan Construction",
      desc: "We coordinate on-site with vetted contractors. From drywall framing and electrical track fittings to bespoke walnut joinery installation, we oversee every milestone's precision.",
      icon: Hammer,
    },
    {
      num: "05",
      title: "Final Styling",
      subtitle: "Curated Dressing",
      desc: "The final reveal. We position custom upholstered sofas, hang curated local artwork, line table elements with bespoke ornaments, and run meticulous fit-and-finish inspections.",
      icon: Sparkles,
    },
  ];

  return (
    <section id="process" className="py-24 bg-[#F5F0E8]/40 relative overflow-hidden border-t border-cream">
      {/* Background Decorative Element */}
      <div className="absolute top-[20%] left-[5%] text-gold/5 font-serif text-[180px] select-none pointer-events-none md:block hidden">
        KLOCHE
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 text-center">
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-3 block">
            The Journey
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight">
            Our Design <span className="font-serif italic text-gold font-normal">and Execution Process</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </div>

        {/* Timeline Grid Wrapper */}
        <div className="relative mt-12">
          
          {/* Horizontal connecting gold line on desktop as requested */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gold/10 via-gold/40 to-gold/10 -translate-y-12 hidden lg:block" />

          <div id="process-timeline" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="bg-white hover:bg-[#FAF8F4] px-5 py-8 border border-gold/10 relative group transition-all duration-300 flex flex-col justify-between min-h-[340px]"
                >
                  <div>
                    {/* Step Num Circular Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="relative inline-flex items-center justify-center w-11 h-11 rounded-full border border-gold bg-[#FAF8F4] text-gold font-serif text-base font-bold group-hover:bg-[#1C1C1A] group-hover:text-[#FAF8F4] group-hover:border-charcoal transition-all duration-300 shadow-sm">
                        {step.num}
                      </div>
                      <StepIcon className="w-5.5 h-5.5 text-[#6B6560] group-hover:text-[#B8965A] transition-colors duration-300 stroke-[1.2]" />
                    </div>

                    {/* Subtitle / Title */}
                    <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-gold font-semibold block mb-1">
                      {step.subtitle}
                    </span>
                    <h3 className="font-serif text-xl font-light text-charcoal tracking-wide mb-3 group-hover:text-[#B8965A] transition-colors duration-200 leading-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans font-light text-xs text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Desktop micro gold dash */}
                  <div className="absolute top-1/2 -right-3 w-6 h-px border-dashed border-gold/30 hidden lg:block last:hidden" />
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

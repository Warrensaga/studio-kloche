import { motion } from "motion/react";
import { MessageSquareCode, Palette, HardHat, Sparkles } from "lucide-react";

export default function Process() {
  const steps = [
    {
      num: "01",
      title: "Consultation",
      subtitle: "First Met & Briefing",
      desc: "We discuss your spatial brief, visual wishes, budget boundaries, and timeline parameters, capturing the structural scope on-site in Nairobi.",
      icon: MessageSquareCode,
    },
    {
      num: "02",
      title: "Concept Design",
      subtitle: "Moodboards & Plans",
      desc: "We outline custom spatial floorplans, coordinate physical material moodboards, curate color palettes, and draft initial 3D design visions.",
      icon: Palette,
    },
    {
      num: "03",
      title: "Execution",
      subtitle: "Master Remodelling",
      desc: "We coordinate with vetted fit-out teams, manage material purchasing, oversee site progress milestones, and oversee structural installation.",
      icon: HardHat,
    },
    {
      num: "04",
      title: "Handover",
      subtitle: "Unveiling & Dressing",
      desc: "We dress your rooms, coordinate bespoke styling pieces, run full quality checks, and hand over your ready-to-live luxurious space.",
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

          <div id="process-timeline" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="bg-zinc-50/50 hover:bg-[#FAF8F4] px-6 py-10 border border-gold/10 relative group transition-all duration-300"
                >
                  {/* Step Num Circular Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full border border-gold bg-[#FAF8F4] text-gold font-serif text-lg font-bold group-hover:bg-[#1C1C1A] group-hover:text-[#FAF8F4] group-hover:border-charcoal transition-all duration-300 shadow-sm">
                      {step.num}
                    </div>
                    <StepIcon className="w-6 h-6 text-[#6B6560] group-hover:text-[#B8965A] transition-colors duration-300 stroke-[1.2]" />
                  </div>

                  {/* Subtitle / Title */}
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-gold font-semibold block mb-1">
                    {step.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-charcoal tracking-wide mb-3 group-hover:text-[#B8965A] transition-colors duration-200">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans font-light text-xs text-muted leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Desktop micro gold dash */}
                  <div className="absolute top-1/2 -right-4 w-8 h-px border-dashed border-gold/30 hidden lg:block last:hidden" />
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

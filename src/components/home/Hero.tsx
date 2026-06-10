import { motion } from "motion/react";
import { ArrowRight, Star, ShieldCheck, Award, Calendar, FolderClock } from "lucide-react";
import portKileleshwa from "../../assets/images/port_kileleshwa_1780735907965.png";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-12 flex flex-col justify-between overflow-hidden bg-kloche-green"
    >
      {/* Immersive Img Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={portKileleshwa}
          alt="Luxury living space by Kloche Interiors"
          className="w-full h-full object-cover object-center filter brightness-[0.45] transition-transform duration-[10000ms] scale-105 animate-[zoom_120s_infinite]"
          referrerPolicy="no-referrer"
        />
        {/* Soft natural ambient shading overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-kloche-dark via-kloche-green/35 to-kloche-dark/75" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Decorative vertical lines and metadata - UX/UI Craftsmanship */}
      <div className="absolute left-12 top-0 h-full w-px bg-white/5 pointer-events-none hidden md:block" />
      <div className="absolute right-12 top-0 h-full w-px bg-white/5 pointer-events-none hidden md:block" />

      {/* Main Content Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center relative z-10 pt-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-left space-y-8"
        >
          {/* Studio Tag */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-3">
            <span className="h-0.5 w-10 bg-kloche-gold"></span>
            <span className="font-sans text-xs tracking-[0.35em] uppercase text-kloche-gold font-semibold">
              Bespoke Interior Architects · Nairobi
            </span>
          </motion.div>

          {/* Premium Headline (Transformation & Lifestyle oriented, no cliché AI buzzwords) */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-neutral-50 leading-[1.08] tracking-tight"
          >
            Sanctuaries of <br />
            <span className="font-serif italic text-kloche-gold font-normal">quiet luxury</span> and form.
          </motion.h1>

          {/* Value proposition (Conversational, expert-led) */}
          <motion.p
            variants={itemVariants}
            className="font-sans font-light text-base md:text-xl text-neutral-100/85 leading-relaxed max-w-2xl"
          >
            We translate architectural volume into timeless, structural homes and spaces. Integrating custom stonework, rich walnut paneling, and warm linen, Kloche Interiors crafts experiences tailored for Nairobi’s most discerning homeowners.
          </motion.p>

          {/* Call to Actions (UX Optimized) */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <a
              id="hero-cta-quote"
              href="#contact"
              className="px-8 py-4.5 bg-kloche-green hover:bg-kloche-green-hover text-[#FAF8F4] transition-all duration-300 tracking-widest text-xs uppercase font-semibold flex items-center gap-2.5 shadow-lg border border-kloche-green rounded-xs"
            >
              Book a Consultation <Calendar className="w-4 h-4 text-white/80" />
            </a>
            <a
              id="hero-cta-portfolio"
              href="#portfolio"
              className="px-10 py-4.5 border border-white/20 hover:border-kloche-gold hover:bg-white/5 text-neutral-50 transition-all duration-300 tracking-widest text-xs uppercase font-medium flex items-center gap-2"
            >
              View Our Projects <ArrowRight className="w-4 h-4 text-kloche-gold" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Immersive stats counter at the bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-[#1C1C1A]/75 backdrop-blur-md border border-white/10 px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10"
        >
          {/* Stat 1 */}
          <div className="flex items-center space-x-4 md:justify-center pb-4 md:pb-0">
            <Star className="w-7 h-7 text-kloche-gold fill-kloche-gold stroke-[1.5]" />
            <div className="text-left">
              <p className="font-serif text-2xl font-semibold text-neutral-50 tracking-tight">4.8★ Client Rating</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-300/85">Verified Local Google Reviews</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center space-x-4 md:justify-center py-4 md:py-0">
            <ShieldCheck className="w-7 h-7 text-kloche-gold stroke-[1.5]" />
            <div className="text-left artisans-metrics">
              <p className="font-serif text-2xl font-semibold text-neutral-50 tracking-tight">100+ Masterpieces</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-300/85">Residential & Commercial Kenya</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center space-x-4 md:justify-center pt-4 md:pt-0">
            <Award className="w-7 h-7 text-kloche-gold stroke-[1.5]" />
            <div className="text-left">
              <p className="font-serif text-2xl font-semibold text-neutral-50 tracking-tight">Bespoke Blueprinting</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-300/85">Concept plans to final handover</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

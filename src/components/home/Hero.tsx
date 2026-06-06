import { motion } from "motion/react";
import { ArrowRight, Star, ShieldCheck, Award } from "lucide-react";

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
      className="relative min-h-screen bg-[#FAF8F4] pt-28 pb-16 flex flex-col justify-center overflow-hidden"
    >
      {/* Decorative Golden Ambient Accent */}
      <div className="absolute -top-[30%] -right-[20%] w-[60%] h-[80%] rounded-full bg-cream/30 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[20%] w-[50%] h-[70%] rounded-full bg-cream/40 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left"
        >
          <motion.div variants={itemVariants} className="flex items-center space-x-2">
            <span className="h-px w-8 bg-gold"></span>
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-medium">Bespoke Interior Studio</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-charcoal leading-[1.08] tracking-tight"
          >
            Spaces that <span className="font-serif italic text-gold font-normal">inspire</span>,<br />
            lives <span className="font-serif italic text-gold font-normal">well lived</span>.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-sans font-light text-base md:text-lg text-muted leading-relaxed max-w-xl"
          >
            Kloche Interiors creates timeless, high-contrast residential and commercial spaces tailored to your lifestyle. We pair rich texture, bold scale, and warm neutrals to orchestrate modern living in Nairobi.
          </motion.p>

          {/* Action Links */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            <a
              id="hero-cta-quote"
              href="#contact"
              className="px-8 py-4 border border-charcoal text-charcoal bg-transparent hover:bg-[#1C1C1A] hover:text-warm-white transition-all duration-300 tracking-widest text-xs uppercase font-medium flex items-center gap-2"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </a>
            <a
              id="hero-cta-portfolio"
              href="#portfolio"
              className="px-8 py-4 border border-gold text-gold bg-transparent hover:bg-gold hover:text-warm-white transition-all duration-300 tracking-widest text-xs uppercase font-medium"
            >
              View Our Work
            </a>
          </motion.div>

          {/* Decorative Gold Line */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-gradient-to-r from-gold/40 via-gold/10 to-transparent pr-12 lg:pr-24 pt-4"
          >
            <div className="h-full bg-gold/50 w-1/4"></div>
          </motion.div>
        </motion.div>

        {/* Right Column Bento Gradient CSS Image Grid */}
        <div className="lg:col-span-5 h-[450px] md:h-[550px] relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any, delay: 0.4 }}
            className="grid grid-cols-2 grid-rows-12 gap-4 h-full"
          >
            {/* Box 1 (Top Left) - Tall Earthy Sand */}
            <div className="row-span-7 bg-cream/10 border border-gold/10 shadow-md relative overflow-hidden group">
              <img 
                src="/src/assets/images/hero_bento_neutrals_1780735823500.png" 
                alt="Minimalist design, warm neutrals" 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.93] transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/0 transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-4 left-4 font-serif text-sm italic text-warm-white opacity-90 z-10">Warm Neutrals</div>
            </div>

            {/* Box 2 (Top Right) - Short Charcoal Minimalist */}
            <div className="row-span-5 bg-[#1C1C1A] border border-gold/10 shadow-md relative overflow-hidden group">
              <img 
                src="/src/assets/images/hero_bento_contrast_1780735840075.png" 
                alt="Charcoal home office" 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 font-serif text-xs italic text-goldLight tracking-wider z-10">01 / Contrast</div>
            </div>

            {/* Box 3 (Bottom Left) - Short Gold Accent */}
            <div className="row-span-5 bg-gold/10 border border-gold/10 shadow-md relative overflow-hidden group">
              <img 
                src="/src/assets/images/hero_bento_texture_1780735856098.png" 
                alt="Interior textures, brass and stone" 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9] transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/0 transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-4 left-4 font-serif text-xs italic text-warm-white z-10">02 / Texture</div>
            </div>

            {/* Box 4 (Bottom Right) - Tall Rich Wood */}
            <div className="row-span-7 bg-[#5C4F42] border border-gold/10 shadow-md relative overflow-hidden group">
              <img 
                src="/src/assets/images/hero_bento_wood_1780735871563.png" 
                alt="Walnut bespoke wood paneling" 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.93] transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/0 transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-4 left-4 font-serif text-sm italic text-[#FAF8F4] opacity-90 z-10">Bespoke Furnishing</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-charcoal text-[#FAF8F4] px-8 py-8 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gold/15"
        >
          {/* Stat 1 */}
          <div className="flex items-center space-x-4 md:justify-center pb-6 md:pb-0">
            <Star className="w-8 h-8 text-gold fill-gold stroke-[1.5]" />
            <div>
              <p className="font-serif text-3xl font-bold text-goldLight tracking-tight">4.8★ Rating</p>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#F5F0E8]/50">10 Google Reviews</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center space-x-4 md:justify-center py-6 md:py-0">
            <ShieldCheck className="w-8 h-8 text-gold stroke-[1.5]" />
            <div>
              <p className="font-serif text-3xl font-bold text-goldLight tracking-tight">100+ Projects</p>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#F5F0E8]/50">Residential & Commercial</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center space-x-4 md:justify-center pt-6 md:pt-0">
            <Award className="w-8 h-8 text-gold stroke-[1.5]" />
            <div>
              <p className="font-serif text-3xl font-bold text-goldLight tracking-tight">5yr+ Studio</p>
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#F5F0E8]/50">Experience & Craft</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

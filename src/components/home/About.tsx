import { motion } from "motion/react";
import { Star, Shield, HelpCircle, Compass, Users } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-28 bg-[#F5F0E8]/40 relative overflow-hidden">
      {/* Structural subtle grids and lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#E2DDD5]/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-48 h-px bg-[#B8965A]/25" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* Left Column: Overlapping Luxury Editorial Collage */}
        <div className="lg:col-span-6 relative h-[520px] md:h-[620px] max-w-lg mx-auto lg:mx-0 w-full lg:sticky lg:top-28">
          
          {/* Main big block - Frame of craftsmanship */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 w-[82%] h-[78%] bg-cream/10 border border-[#B8965A]/15 shadow-2xl overflow-hidden group"
          >
            <img 
              src="/src/assets/images/about_main_craft_1780735888676.png" 
              alt="Esther Kloche during a bespoke materials study in Westlands" 
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#1C1C1A]/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
          </motion.div>

          {/* Overlapping secondary block representing the studio's material board */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute bottom-0 right-0 w-[55%] h-[55%] bg-[#1C1C1A] border-t-2 border-l-2 border-[#B8965A] shadow-2xl p-6 md:p-8 flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start">
              <span className="font-serif text-[10px] tracking-widest text-[#FAF8F4]/50 leading-relaxed uppercase">Nairobi, KE</span>
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-serif text-2xl font-light text-warm-white leading-tight">Authentic Material boards</p>
              <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold">Walnut, Linen, Slate, Brass</p>
            </div>
          </motion.div>

          {/* Local Rating Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="absolute -right-2 top-24 bg-[#1C1C1A]/95 text-[#FAF8F4] py-4 px-5 rounded-none shadow-xl border border-[#B8965A]/30 flex flex-col items-center justify-center text-center space-y-1.5 z-20 backdrop-blur-xs"
          >
            <div className="flex items-center space-x-1">
              <Star className="w-4.5 h-4.5 fill-gold text-gold stroke-none" />
              <span className="font-serif text-xl font-bold text-goldLight">4.8★</span>
            </div>
            <span className="font-sans text-[8px] tracking-[0.22em] uppercase text-[#F5F0E8]/50 font-semibold">10 Verified Google Reviews</span>
          </motion.div>
        </div>

        {/* Right Column: Founder Narrative, Philosophy columns & Client Review */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 flex flex-col justify-start space-y-10"
        >
          {/* Header */}
          <div>
            <span className="font-sans text-xs tracking-[0.35em] uppercase text-gold font-semibold mb-3.5 block">
              Founder Profile & Story
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight leading-[1.12]">
              Esther Kloche <br />
              <span className="font-serif italic text-gold font-normal">and the Soul of the Studio</span>
            </h2>
          </div>

          {/* Genuine Narrative Story */}
          <div className="space-y-5 font-sans font-light text-sm md:text-base text-muted leading-relaxed">
            <p>
              "I started Kloche Interiors with a simple realization: spaces are not just structures to occupy; they are canvases for the soul," says founder and principal interior designer **Esther Kloche**. "After years of practicing design in sub-Saharan Africa, I felt a deep pull to return to honest, natural resources and create a studio on Karuna Road that honors them."
            </p>
            <p>
              Our studio rejects the cold, sterile assembly-line look that occupies much of modern design. Instead, we spend our days collaborating directly with local Kenyan wood artisans, veteran stonemasons, and textile curators. We seek physical depth over digital render aesthetics—focusing on how raw walnut furniture fits against fine-texture linen, and how light cascades across lime-wash wall formulations.
            </p>
          </div>

          {/* 3 Core Design Philosophies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E2DDD5]">
            {/* Phil 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-gold">
                <Compass className="w-4.5 h-4.5" />
                <span className="font-serif text-sm font-semibold tracking-wide text-charcoal">Earthy Harmony</span>
              </div>
              <p className="font-sans text-xs text-muted font-light leading-relaxed">
                Balancing warm travertine stones, raw structural timbers, and calm textiles.
              </p>
            </div>

            {/* Phil 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-gold">
                <Users className="w-4.5 h-4.5" />
                <span className="font-serif text-sm font-semibold tracking-wide text-charcoal">Artisan Respect</span>
              </div>
              <p className="font-sans text-xs text-muted font-light leading-relaxed">
                Prioritizing hand-joined timber craftsmanship and customized metal hardware over flat imports.
              </p>
            </div>

            {/* Phil 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-gold">
                <Shield className="w-4.5 h-4.5" />
                <span className="font-serif text-sm font-semibold tracking-wide text-charcoal">Physical Integrity</span>
              </div>
              <p className="font-sans text-xs text-muted font-light leading-relaxed">
                Detailing furniture depth and walking coordinates to assure perfect flow.
              </p>
            </div>
          </div>

          {/* Editorial Pull Quote */}
          <div className="border-l-2 border-gold pl-6 py-3 my-2 bg-cream/20">
            <p className="font-serif italic text-base md:text-lg text-charcoal/90 leading-relaxed mb-3">
              "Kloche Interiors did not compile layout drawings from Pinterest; they constructed a custom sanctuary. The physical timber accents in our Lavington house feel like a living art gallery."
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-[#B8965A] font-semibold">
              — Givence Awuor <span className="font-light text-muted">· Nairobi Residence Client</span>
            </p>
          </div>

          {/* Book / Action */}
          <div className="pt-2">
            <a
              id="about-cta-consult"
              href="#contact"
              className="inline-flex items-center justify-center px-10 py-4 border border-charcoal text-charcoal bg-transparent hover:bg-charcoal hover:text-warm-white transition-all duration-300 tracking-widest text-xs uppercase font-semibold"
            >
              Meet Esther & The Studio
            </a>
          </div>

        </motion.div>
      </div>
    </section>
  );
}


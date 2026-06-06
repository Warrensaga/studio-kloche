import { motion } from "motion/react";
import { Instagram, ArrowUpRight } from "lucide-react";

export default function Portfolio() {
  const portfolios = [
    {
      id: 1,
      title: "The Kileleshwa Residency",
      category: "Full Concept Interior Design",
      image: "/src/assets/images/port_kileleshwa_1780735907965.png",
      span: "lg:col-span-2 lg:row-span-2 h-[350px] lg:h-full",
    },
    {
      id: 2,
      title: "Gigiri Executive Offices",
      category: "Brand-Aligned Workspaces",
      image: "/src/assets/images/port_gigiri_1780735924591.png",
      span: "h-[220px]",
    },
    {
      id: 3,
      title: "Lavington Penthouse",
      category: "Furniture Curator & Styling",
      image: "/src/assets/images/port_lavington_1780735940153.png",
      span: "h-[220px]",
    },
    {
      id: 4,
      title: "Westlands Airbnb Retreat",
      category: "Short Let Styling Model",
      image: "/src/assets/images/port_airbnb_1780735957635.png",
      span: "h-[220px]",
    },
    {
      id: 5,
      title: "The Kilimani Townhouse",
      category: "Room Remodelling & Renovation",
      image: "/src/assets/images/port_kilimani_1780735974645.png",
      span: "h-[220px]",
    },
  ];

  return (
    <section id="portfolio" className="py-24 bg-[#FAF8F4] relative border-t border-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-3 block">
              Curated Projects
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              Selected Works <span className="font-serif italic text-gold font-normal">and Feats</span>
            </h2>
          </div>
          <p className="font-sans font-light text-sm text-muted max-w-sm mt-4 md:mt-0 leading-relaxed">
            A small collection of recent spatial redesigns, full structural renovations, and short let stylings executed to perfection.
          </p>
        </div>

        {/* Asymmetric CSS grid as requested (large left, smaller right) */}
        <div id="portfolio-grid" className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:h-[500px] mb-12">
          
          {/* Large display (items[0]) */}
          <motion.a
            href="https://www.instagram.com/klocheinteriors"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="col-span-1 lg:col-span-2 group relative bg-[#1C1C1A] overflow-hidden shadow-md flex items-end p-8 min-h-[350px] lg:min-h-full"
          >
            {/* Real Background Image */}
            <img 
              src={portfolios[0].image} 
              alt={portfolios[0].title} 
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            {/* Hover Darken + Gradient Cover */}
            <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/75 transition-all duration-500 z-10" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 z-20 pointer-events-none" />

            <div className="relative z-20 text-[#FAF8F4] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-goldLight font-medium block mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {portfolios[0].category}
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl font-light tracking-wide group-hover:text-gold transition-colors duration-300">
                {portfolios[0].title}
              </h3>
            </div>
            
            <div className="absolute top-6 right-6 z-20 w-10 h-10 border border-warm-white/20 group-hover:border-gold flex items-center justify-center text-warm-white group-hover:text-gold opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </motion.a>

          {/* Right Smaller Items Grid (col-span-1 lg:col-span-2 containing a 2x2 layout of 4 grid cells) */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {portfolios.slice(1).map((project, idx) => (
              <motion.a
                key={project.id}
                href="https://www.instagram.com/klocheinteriors"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative bg-[#1C1C1A] overflow-hidden shadow-md flex items-end p-6 min-h-[200px]"
              >
                {/* Real Background Image */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/70 transition-all duration-500 z-10" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 z-20 pointer-events-none" />
                
                <div className="relative z-20 text-[#FAF8F4] translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-goldLight font-medium block mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.category}
                  </span>
                  <h3 className="font-serif text-xl font-light tracking-wide group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
                
                <div className="absolute top-5 right-5 z-20 w-8 h-8 border border-warm-white/15 group-hover:border-gold flex items-center justify-center text-warm-white group-hover:text-gold opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>

        </div>

        {/* View on IG Button as requested */}
        <div className="text-center">
          <a
            id="portfolio-cta-instagram"
            href="https://www.instagram.com/klocheinteriors"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-charcoal text-charcoal bg-transparent hover:bg-[#1C1C1A] hover:text-warm-white px-8 py-4 transition-all duration-300 tracking-widest text-xs uppercase font-medium focus:outline-none"
          >
            <Instagram className="w-4 h-4 text-gold fill-transparent group-hover:text-warm-white transition-colors" /> View More on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

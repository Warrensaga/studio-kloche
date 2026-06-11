import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Instagram, HelpCircle, Compass, ShieldCheck, HelpCircle as QuestionIcon, PlusCircle, ArrowRight } from "lucide-react";

import portKileleshwa from "../../assets/images/port_kileleshwa_1780735907965.png";
import portGigiri from "../../assets/images/port_gigiri_1780735924591.png";
import portLavington from "../../assets/images/port_lavington_1780735940153.png";
import portAirbnb from "../../assets/images/port_airbnb_1780735957635.png";
import portKilimani from "../../assets/images/port_kilimani_1780735974645.png";

interface ProjectDetail {
  id: number;
  title: string;
  category: string;
  image: string;
  before: string;
  after: string;
  goal: string;
  challenge: string;
  outcome: string;
  collabs: string;
}

export default function Portfolio() {
  const [activeIdx, setActiveIdx] = useState(0);

  const portfolios: ProjectDetail[] = [
    {
      id: 1,
      title: "The Kileleshwa Residency",
      category: "Full Concept Interior Design",
      image: portKileleshwa,
      before: "A cold, high-ceiling duplex apartment with orange ceramic tiles, acoustic echo issues, and stark white gypsum surfaces.",
      after: "A warm, double-volume living salon styled with split travertine slabs, soft walnut timber cladding, and hand-finished lime wash walls.",
      goal: "Introduce organic spatial warmth and sound absorption while celebrating the magnificent height and natural light profile of the double-volume architecture.",
      challenge: "Managing the dramatic 6-meter ceiling height without making the gathering hub feel chilly, intimidating, or unhomely.",
      outcome: "We mounted continuous vertical walnut rib elements to ground the height and hand-picked split-face travertine for the fireplace column, paired with thick custom upholstered boucle sofas.",
      collabs: "Bespoke Joinery Division Kloche, Karuna Wood Artisans",
    },
    {
      id: 2,
      title: "Gigiri Executive Offices",
      category: "Brand-Aligned Workspaces",
      image: portGigiri,
      before: "A cramped, outdated 90s corporate suite partitioned with low-grade gypsum board, stained carpets, and flat fluorescent lights.",
      after: "An elegant, light-filled administrative studio focused on physical wellness, continuous oak workbenches, and built-in organic planters.",
      goal: "Eradicate corporate isolation and cubicle silos. Build a healthy creative agency headquarters that promotes natural air circulation and team ideation.",
      challenge: "Integrating extensive physical material boards, sample cabinets, and acoustic meeting nooks within a constrained 200-sq-meter blueprint.",
      outcome: "We laid seamless warm micro-cement flooring, fitted flush timber storage dividers, and integrated dual fluted-glass acoustic meeting pods with blackened steel frames.",
      collabs: "Nairobi Steel Framers, Karuna Millwork Division",
    },
    {
      id: 3,
      title: "Lavington Penthouse",
      category: "Furniture Sourcing & Styling",
      image: portLavington,
      before: "A newly constructed luxury shell with generic marble slate tiles and uninspiring white wall boundaries.",
      after: "An editorial-level penthouse styled with rich walnut furniture nodes, heavy linen drapery, and a curation of local abstract sculptures.",
      goal: "Compose a deeply personal environment that unifies the owner's extensive collection of East African fine art with functional entertainment zones.",
      challenge: "Transporting and installing a monolithic, customized 3-meter solid travertine dining slab through narrow helical stair coordinates.",
      outcome: "We rigged the dining slab externally via secure crane coordinates, building a custom steel-reinforced structural table frame, complemented by tailored Belgian linen chairs.",
      collabs: "Keith Locho Sourcing, Local Fine Art Curators",
    },
    {
      id: 4,
      title: "Westlands Airbnb Retreat",
      category: "Short Let Styling",
      image: portAirbnb,
      before: "A standard, uninspiring concrete studio flat featuring generic laminates and standard commercial retail furniture.",
      after: "A high-fidelity photographic sanctuary lined with hand-finished plaster, natural rattan cabinets, and custom brass light fixtures.",
      goal: "Orchestrate premium booking interest and maximize listing rents by designing a cinematic, deeply tactile backdrop optimized for digital platforms.",
      challenge: "Providing extreme structural durability for rapid Guest changes while operating on a highly disciplined, condensed 4-week styling budget.",
      outcome: "We coated the walls in organic lime-wash, customized durable local hardwood storage vectors, and focused the budget on touch-points like native brass lighting rails and heavy linen.",
      collabs: "Kenyan Rattan Weavers, Westlands Brass Artisans",
    },
    {
      id: 5,
      title: "The Kilimani Townhouse",
      category: "Room Remodelling",
      image: portKilimani,
      before: "A dated brick townhouse block with narrow, dim hallways, boxed partitions, and low-grade mahogany baseboards.",
      after: "A free-flowing architectural workspace with open-plan kitchen-to-living transitions and customized modern steel glass partitions.",
      goal: "Deconstruct the internal partition walls to merge the dining, kitchen, and exterior terrace fields into a singular fluid social landscape.",
      challenge: "Resolving older structural support calculations during the complete demolition of two load-bearing brick masonry partitions.",
      outcome: "We inserted an exposed load-bearing structural RSJ beam wrapped in premium fluted walnut paneling, completely opening the floorplan to our new kitchen layout.",
      collabs: "Nairobi Structural Engineers, Kloche Construct Vetted fit-out team",
    },
  ];

  const currentProject = portfolios[activeIdx];

  return (
    <section id="portfolio" className="py-24 bg-[#F5F0E8] relative border-t border-kloche-gold/20 overflow-hidden">
      {/* Structural visual lines */}
      <div className="absolute top-0 left-12 w-px h-full bg-[#E2DDD5]/30 hidden xl:block" />
      <div className="absolute top-0 right-12 w-px h-full bg-[#E2DDD5]/30 hidden xl:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="font-sans text-xs tracking-[0.35em] uppercase text-kloche-green font-bold mb-3 block">
              Editorial Selected Works
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              Crafted Homes <span className="font-serif italic text-kloche-green font-normal">& Renovated Spaces</span>
            </h2>
          </div>
          <p className="font-sans font-light text-sm text-muted max-w-lg leading-relaxed">
            We move beyond shallow aesthetics. Explore the specific design goals, complex challenges, and physical hand-crafted material outcomes defining Kloche Interiors.
          </p>
        </div>

        {/* Dynamic Split Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
          
          {/* LEFT: Project Navigation Titles List (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-sans text-[10px] tracking-widest text-kloche-green font-bold uppercase block mb-6">
              Select Project Archive
            </span>

            <div className="space-y-2 border-l border-[#E2DDD5]/80">
              {portfolios.map((project, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={project.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full text-left pl-6 py-5.5 transition-all duration-300 relative focus:outline-none block group ${
                      isActive 
                        ? "text-charcoal font-medium bg-[#F5F0E8]/50 border-l-2 border-kloche-gold -ml-px" 
                        : "text-muted hover:text-charcoal border-l border-transparent hover:bg-[#F5F0E8]/20 -ml-px"
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-sans text-[9px] tracking-wider uppercase text-kloche-gold pointer-events-none mb-1">
                        {project.category}
                      </span>
                      <span className="font-serif text-xl md:text-2xl font-light tracking-wide pointer-events-none">
                        {project.title}
                      </span>
                    </div>

                    {/* Minimal hover indicator */}
                    <ArrowRight className={`w-4 h-4 text-kloche-gold absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`} />
                  </button>
                );
              })}
            </div>

            <div className="pt-6">
              <a
                href="https://www.instagram.com/klocheinteriors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-sans text-xs tracking-widest text-charcoal hover:text-kloche-gold uppercase font-semibold transition-colors duration-300 py-2 group"
              >
                <Instagram className="w-4 h-4" /> Live Projects on Instagram <ArrowUpRight className="w-4 h-4 text-kloche-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* RIGHT: High-End Active Showcase Board (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-[#E2DDD5]/80 shadow-xs overflow-hidden flex flex-col lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                {/* Immersive Image Canvas */}
                <div className="relative aspect-16/10 md:aspect-21/9 overflow-hidden bg-cream/10">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="w-full h-full object-cover transition-transform duration-[8000ms] scale-102 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-charcoal text-white text-[9px] font-sans tracking-widest uppercase px-3 py-1.5 font-semibold">
                    {currentProject.category}
                  </div>
                </div>

                {/* Grid of Detailed Specifications */}
                <div className="p-8 md:p-10 space-y-8">
                  
                  {/* Before & After Dual-Column Section */}
                  <div className="pb-6 border-b border-[#E2DDD5]/60">
                    <h4 className="font-serif text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-kloche-gold" /> Spatial Transformation
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      {/* Before column */}
                      <div className="bg-[#FAF8F4] p-4 border-l border-kloche-gold/40 md:border-l-2">
                        <span className="font-sans text-[9px] tracking-widest uppercase text-muted font-bold block mb-1">Before Conditions</span>
                        <p className="font-sans font-light text-xs text-muted leading-relaxed">
                          {currentProject.before}
                        </p>
                      </div>

                      {/* After column */}
                      <div className="bg-[#FAF8F4] p-4 border-l border-emerald-500/50 md:border-l-2">
                        <span className="font-sans text-[9px] tracking-widest uppercase text-emerald-600 font-bold block mb-1">Renovated Architecture</span>
                        <p className="font-sans font-light text-xs text-charcoal/85 leading-relaxed">
                          {currentProject.after}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Goal & Challenge Narrative Text */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pb-6 border-b border-[#E2DDD5]/60">
                    {/* Goal */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-kloche-gold">
                        <Compass className="w-4.5 h-4.5 shrink-0" />
                        <span className="font-serif text-base font-semibold text-charcoal">Design Intent & Goal</span>
                      </div>
                      <p className="font-sans font-light text-xs text-muted leading-relaxed">
                        {currentProject.goal}
                      </p>
                    </div>

                    {/* Challenge */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-kloche-gold">
                        <QuestionIcon className="w-4.5 h-4.5 shrink-0" />
                        <span className="font-serif text-base font-semibold text-charcoal">The Spatial Challenge</span>
                      </div>
                      <p className="font-sans font-light text-xs text-muted leading-relaxed">
                        {currentProject.challenge}
                      </p>
                    </div>
                  </div>

                  {/* Outcome and Sourcing footer */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-2">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-[#FAF8F4] bg-kloche-green px-3 py-1 font-sans text-[9px] tracking-widest uppercase font-semibold w-fit">
                        <ShieldCheck className="w-3.5 h-3.5" /> Luxury Material Outcome
                      </div>
                      <p className="font-sans text-xs text-charcoal font-light leading-relaxed max-w-xl">
                        {currentProject.outcome}
                      </p>
                    </div>

                    {/* Technical partners logo label */}
                    <div className="font-sans border-l border-[#E2DDD5] pl-4 md:-ml-4 self-stretch md:self-auto flex flex-col justify-center shrink-0">
                      <span className="text-[8px] tracking-widest text-muted uppercase block">Execution Division</span>
                      <span className="text-[10px] font-semibold text-charcoal uppercase tracking-wider block mt-0.5 max-w-[160px] leading-tight">
                        {currentProject.collabs}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

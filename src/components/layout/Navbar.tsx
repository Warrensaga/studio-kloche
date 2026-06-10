import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Renovations", href: "#portfolio-projects" },
    { name: "Process", href: "#process" },
    { name: "Reviews", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-warm-white/95 backdrop-blur-md py-3.5 border-b border-kloche-gold/15 text-charcoal shadow-sm"
          : "bg-cream py-4.5 border-b border-kloche-green/5 text-charcoal"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo SVG */}
        <Link
          id="nav-logo"
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="transition-all duration-300 hover:opacity-90 scale-95 md:scale-100 origin-left"
        >
          <Logo variant="horizontal" size={38} light={theme === "dark"} />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center space-x-8 font-sans text-sm tracking-widest uppercase">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative py-1 transition-all duration-300 text-charcoal hover:text-kloche-green dark:hover:text-kloche-gold font-medium border-b border-transparent hover:border-kloche-green dark:hover:border-kloche-gold"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 border border-kloche-green/20 hover:border-kloche-gold text-charcoal hover:text-kloche-green transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center bg-transparent"
            aria-label="Toggle Theme"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-kloche-gold" /> : <Moon className="w-4 h-4 text-kloche-green" />}
          </button>

          <a
            id="nav-cta-desktop"
            href="https://wa.me/254717634003?text=Hi%20Kloche%20Interiors%20-%20I%20would%20like%20to%20get%20a%20luxury%20design%20consultation%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-kloche-green text-[#FAF8F4] px-5 py-2.5 hover:bg-kloche-gold hover:text-[#1F1C1B] transition-all duration-300 tracking-widest text-xs uppercase font-semibold rounded-xs shadow-xs"
          >
            Get a Quote <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile controls & toggle */}
        <div className="flex lg:hidden items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 border border-kloche-green/20 hover:border-kloche-gold text-charcoal hover:text-kloche-green transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center bg-transparent"
            aria-label="Toggle Theme"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-kloche-gold" /> : <Moon className="w-4 h-4 text-kloche-green" />}
          </button>

          {/* Hamburger Toggle */}
          <button
            id="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 focus:outline-none transition-colors duration-300 text-charcoal hover:text-kloche-green dark:hover:text-kloche-gold"
            aria-label="Toggle Navigation Screen"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-cream text-charcoal z-40 flex flex-col justify-center px-8 md:px-16"
          >
            <div className="absolute top-6 right-6">
              <button
                id="nav-close-mobile"
                onClick={() => setIsOpen(false)}
                className="text-charcoal p-2 hover:text-kloche-green dark:hover:text-kloche-gold"
                aria-label="Close Screen"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col space-y-5 font-serif text-3xl md:text-4xl text-left select-none">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="hover:text-kloche-green dark:hover:text-kloche-gold transition-colors duration-300 py-1 border-b border-kloche-gold/15 text-charcoal"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
                className="pt-4 flex flex-col gap-6"
              >
                <a
                  href="https://wa.me/254717634003?text=Hi%20Kloche%20Interiors%20-%20I%20would%20like%20to%20get%20a%20luxury%20design%20consultation%20quote."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-fit text-center bg-kloche-green text-[#FAF8F4] font-sans px-8 py-3.5 hover:bg-kloche-gold hover:text-[#1F1C1B] transition-colors duration-300 text-sm tracking-widest uppercase flex items-center gap-2 rounded-xs"
                >
                  Get a Quote <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
            
            <div className="absolute bottom-12 left-8 md:left-16 text-muted font-sans text-xs tracking-widest gap-2 flex flex-col uppercase">
              <p>Karuna Rd, Nairobi, Kenya</p>
              <p>0717 634003 / klocheinteriors@gmail.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

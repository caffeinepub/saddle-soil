import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Tours", href: "#tours" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.21 0.050 150) 0%, oklch(0.26 0.060 150) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("#home")}
            className="flex items-center gap-3 group"
            data-ocid="nav.link"
          >
            <img
              src="/assets/logo_saddle_and_soil-019d3e17-6375-7131-aac5-076e3207f094.png"
              alt="Saddle & Soil"
              className="h-12 w-12 object-contain"
            />
            <div>
              <div className="font-condensed font-bold text-lg text-white uppercase tracking-widest leading-none">
                Saddle &amp; Soil
              </div>
              <div className="font-barlow text-[10px] text-brand-muted tracking-[0.2em] uppercase leading-none mt-0.5">
                Beyond the Finish
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="font-condensed font-semibold text-sm uppercase tracking-widest text-white/80 hover:text-white transition-colors duration-200"
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav("#contact")}
              className="hidden md:block btn-orange text-sm py-2 px-5"
              data-ocid="nav.primary_button"
            >
              Book Your Journey
            </button>
            <button
              type="button"
              className="md:hidden p-2 text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10"
            style={{ background: "oklch(0.21 0.050 150)" }}
          >
            <nav className="flex flex-col py-4 px-6 gap-3">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="font-condensed font-semibold text-base uppercase tracking-widest text-white/80 hover:text-white py-2 border-b border-white/10 text-left"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleNav("#contact")}
                className="btn-orange text-center text-sm mt-2"
                data-ocid="nav.primary_button"
              >
                Book Your Journey
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

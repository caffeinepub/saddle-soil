import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.04 150) 0%, oklch(0.21 0.050 150) 35%, oklch(0.26 0.060 150) 60%, oklch(0.24 0.035 52) 85%, oklch(0.14 0.03 50) 100%)",
      }}
    >
      {/* Hero image overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-marathon.dim_1800x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          mixBlendMode: "luminosity",
        }}
      />

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-16 w-64 h-64 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--brand-orange)), transparent)",
            animation: "hero-float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-32 left-10 w-48 h-48 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--brand-orange)), transparent)",
            animation: "hero-float-2 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-96 h-1 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(var(--brand-orange)), transparent)",
            transform: "rotate(-15deg)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-6 border border-brand-orange/40 px-4 py-1.5 rounded-full">
              Premium Marathon Travel
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-condensed font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white uppercase leading-[0.9] mb-6"
          >
            Run Global
            <br />
            <span className="text-brand-orange">Marathons,</span>
            <br />
            Discover
            <br />
            the World.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-barlow text-base md:text-lg max-w-lg mb-10 leading-relaxed"
            style={{ color: "oklch(0.92 0.015 78)" }}
          >
            We curate extraordinary marathon travel experiences for Indian
            runners at the world's most iconic races. Beyond the finish line
            lies the real journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <button
              type="button"
              className="btn-orange flex items-center gap-2 text-base"
              onClick={() => handleScroll("#tours")}
              data-ocid="hero.primary_button"
            >
              Explore Tours <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="btn-dark flex items-center gap-2 text-base"
              onClick={() => handleScroll("#about")}
              data-ocid="hero.secondary_button"
            >
              Learn More
            </button>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-8 mt-16 pt-10 border-t border-white/10"
          >
            {[
              { value: "500+", label: "Runners" },
              { value: "12+", label: "Countries" },
              { value: "50+", label: "Marathons" },
              { value: "8 Yrs", label: "Experience" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-condensed font-bold text-3xl text-white">
                  {stat.value}
                </div>
                <div className="font-barlow text-xs uppercase tracking-widest text-brand-muted mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        onClick={() => handleScroll("#about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
        aria-label="Scroll down"
      >
        <span className="font-condensed text-xs uppercase tracking-widest">
          Scroll
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.button>
    </section>
  );
}

import { motion } from "motion/react";

const stats = [
  { value: "500+", label: "Runners Served" },
  { value: "12+", label: "Countries" },
  { value: "50+", label: "Marathons" },
  { value: "8", label: "Years of Excellence" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 block">
              Our Story
            </span>
            <h2 className="font-condensed font-bold text-4xl md:text-5xl lg:text-6xl text-brand-text uppercase leading-tight mb-6">
              Born From the Trails,
              <br />
              <span className="text-brand-green">Built For Runners</span>
            </h2>
            <div
              className="space-y-4 font-barlow text-base leading-relaxed"
              style={{ color: "oklch(0.35 0.020 65)" }}
            >
              <p>
                Saddle &amp; Soil was founded by runners, for runners. We know
                the thrill of toe-ing the start line at a world-class marathon —
                the nervous energy, the crowd roar, the sheer scale of it all.
                Our mission is to make that dream accessible to every passionate
                Indian runner.
              </p>
              <p>
                We don't just book flights and hotels. We craft end-to-end
                experiences — from race bib registration to cultural immersion,
                recovery days to farewell dinners. Every itinerary is built
                around the runner's journey: before, during, and long after the
                finish line.
              </p>
              <p>
                With deep local networks in Tokyo, Berlin, New York, and beyond,
                we handle every logistical detail so you can focus entirely on
                running your best race. Your only job is to show up and run.
              </p>
            </div>
          </motion.div>

          {/* Image + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="/assets/generated/about-team.dim_800x600.jpg"
                alt="Indian runners celebrating at a marathon finish line"
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-brand-green rounded-xl p-5 flex flex-col items-center text-center"
                  data-ocid="about.card"
                >
                  <span className="font-condensed font-bold text-4xl text-brand-orange">
                    {stat.value}
                  </span>
                  <span className="font-barlow text-xs uppercase tracking-widest text-brand-muted mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

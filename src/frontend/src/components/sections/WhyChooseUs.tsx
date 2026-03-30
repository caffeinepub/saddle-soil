import { motion } from "motion/react";

const features = [
  {
    icon: "\uD83C\uDFAF",
    title: "Expert Curation",
    description:
      "Handpicked marathons, hotels, and experiences tailored specifically for Indian runners.",
  },
  {
    icon: "\uD83E\uDD1D",
    title: "End-to-End Support",
    description:
      "From visa assistance to race-day cheering, we've got you covered every step of the way.",
  },
  {
    icon: "\uD83D\uDC65",
    title: "Group Travel",
    description:
      "Run with a community of like-minded Indian runners from across the country.",
  },
  {
    icon: "\uD83C\uDF0D",
    title: "Local Expertise",
    description:
      "On-ground guides who know the city, the culture, and the race route inside out.",
  },
  {
    icon: "\uD83D\uDCCB",
    title: "Visa Assistance",
    description:
      "Complete documentation support and visa guidance for hassle-free international travel.",
  },
  {
    icon: "\uD83C\uDFC5",
    title: "Race Entry Guaranteed",
    description:
      "We secure your race bib so you don't have to navigate the lottery system alone.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 block">
            Our Promise
          </span>
          <h2 className="font-condensed font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase">
            Why Choose Saddle &amp; Soil
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="rounded-xl p-7 hover:scale-[1.02] transition-transform duration-200 cursor-default"
              style={{ backgroundColor: "oklch(0.22 0.055 150)" }}
              data-ocid={`why.card.${i + 1}`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-condensed font-bold text-xl text-white uppercase tracking-wide mb-2">
                {feature.title}
              </h3>
              <p className="font-barlow text-sm text-brand-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

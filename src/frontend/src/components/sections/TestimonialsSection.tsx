import type { Testimonial } from "@/backend";
import { useGetActiveTestimonials } from "@/hooks/useQueries";
import { Quote } from "lucide-react";
import { motion } from "motion/react";

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ravi Sharma",
    city: "Mumbai",
    marathon: "Tokyo Marathon 2024",
    quote:
      "An absolute dream come true! Saddle & Soil handled everything — from the visa to the race bib. Tokyo was magical, and having a group of Indian runners made it even more special. Already signed up for Berlin!",
    rating: BigInt(5),
    active: true,
    createdAt: BigInt(0),
  },
  {
    id: "t2",
    name: "Priya Nair",
    city: "Bengaluru",
    marathon: "Berlin Marathon 2023",
    quote:
      "I was nervous about running my first international marathon abroad. The team's support on race day was incredible. Berlin will stay with me forever. Can't wait for New York!",
    rating: BigInt(5),
    active: true,
    createdAt: BigInt(0),
  },
  {
    id: "t3",
    name: "Arjun Mehta",
    city: "Delhi",
    marathon: "New York Marathon 2023",
    quote:
      "World-class organization. The itinerary was perfectly balanced — race preparation, sightseeing, and recovery. Worth every rupee. Already registered for Chicago!",
    rating: BigInt(5),
    active: true,
    createdAt: BigInt(0),
  },
];

function TestimonialCard({
  testimonial,
  index,
}: { testimonial: Testimonial; index: number }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-7 shadow-sm flex flex-col"
      data-ocid={`testimonials.card.${index + 1}`}
    >
      <Quote className="w-8 h-8 text-brand-orange mb-4 opacity-70" />
      <p
        className="font-barlow text-base leading-relaxed flex-1"
        style={{ color: "oklch(0.35 0.018 60)" }}
      >
        "{testimonial.quote}"
      </p>
      <div className="flex items-center gap-4 mt-6 pt-5 border-t border-border">
        <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
          <span className="font-condensed font-bold text-base text-white">
            {initials}
          </span>
        </div>
        <div>
          <div className="font-condensed font-bold text-base text-brand-text">
            {testimonial.name}
          </div>
          <div
            className="font-barlow text-xs mt-0.5"
            style={{ color: "oklch(0.55 0.020 65)" }}
          >
            {testimonial.city} • {testimonial.marathon}
          </div>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: Number(testimonial.rating) }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static star ratings
              <span key={i} className="text-brand-orange text-sm">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useGetActiveTestimonials();
  const displayTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : SEED_TESTIMONIALS;

  return (
    <section id="testimonials" className="py-20 md:py-28 px-4 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 block">
            Runner Stories
          </span>
          <h2 className="font-condensed font-bold text-4xl md:text-5xl lg:text-6xl text-brand-text uppercase">
            What Our Runners Say
          </h2>
        </motion.div>

        {isLoading ? (
          <div
            className="flex justify-center py-16"
            data-ocid="testimonials.loading_state"
          >
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

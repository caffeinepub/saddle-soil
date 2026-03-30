import type { Tour } from "@/backend";
import { Variant_active_draft } from "@/backend";
import { useGetTours } from "@/hooks/useQueries";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SEED_TOUR: Tour = {
  id: "seed-tokyo",
  status: Variant_active_draft.active,
  title: "Tokyo Marathon 2026",
  destination: "Tokyo, Japan",
  duration: "8 Days / 7 Nights",
  description:
    "Experience the magic of running through Tokyo — one of the world's most beloved marathons. Join a curated group of Indian runners for an unforgettable journey blending athletic achievement with Japanese culture.",
  highlights: [
    "Race Bib at Tokyo Marathon",
    "7 Nights 4-Star Hotels",
    "Expert Running Guide",
    "Pasta Party & Expo Visit",
    "Hakone Day Trip",
    "Airport Transfers Included",
  ],
  itinerary: [
    {
      day: BigInt(1),
      title: "Arrival in Tokyo",
      description:
        "Land at Narita/Haneda, hotel check-in, welcome briefing, early rest to beat jet lag.",
    },
    {
      day: BigInt(2),
      title: "Tokyo Orientation & Expo",
      description:
        "Morning orientation walk through the race route. Afternoon: Tokyo Marathon Expo for bib collection and pasta party evening.",
    },
    {
      day: BigInt(3),
      title: "Race Day — Tokyo Marathon!",
      description:
        "The big day! 42.2km through Tokyo's iconic streets. Group support, cheering stations, and finish-line celebration.",
    },
    {
      day: BigInt(4),
      title: "Recovery & Culture",
      description:
        "Gentle recovery walk. Visit Senso-ji Temple, Asakusa. Evening stroll through Shibuya Crossing at night.",
    },
    {
      day: BigInt(5),
      title: "Hakone & Mt. Fuji Views",
      description:
        "Day trip to Hakone National Park. Cable car rides, open-air museum, and stunning views of Mt. Fuji.",
    },
    {
      day: BigInt(6),
      title: "Tokyo Exploration",
      description:
        "Akihabara electronics district, Harajuku fashion streets, Meiji Shrine serene gardens.",
    },
    {
      day: BigInt(7),
      title: "Free Day & Farewell Dinner",
      description:
        "Free time for shopping and last-minute exploration. Farewell dinner with the group at a traditional Japanese restaurant.",
    },
    {
      day: BigInt(8),
      title: "Departure Day",
      description:
        "Hotel checkout, airport transfers arranged, fond farewells. Until the next race!",
    },
  ],
  inclusions: [
    "Race Bib Entry \u2013 Tokyo Marathon",
    "7 Nights Accommodation (4-Star Hotel, Twin Sharing)",
    "Airport Transfers (Arrival & Departure)",
    "Expert Running Guide & Race Day Support",
    "Group Activities & Sightseeing Tours",
    "Pasta Party & Welcome Kit",
    "Hakone Day Trip with Transport",
  ],
  exclusions: [
    "International Flights (Delhi/Mumbai to Tokyo)",
    "Japan Tourist Visa Fees",
    "Travel Insurance",
    "Personal Expenses & Shopping",
    "Optional Excursions not listed",
  ],
  price: "\u20b91,89,000 per person",
  createdAt: BigInt(0),
};

function TourCard({ tour }: { tour: Tour }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: "oklch(0.22 0.055 150)" }}
      data-ocid="tours.card"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src="/assets/generated/tour-tokyo.dim_800x500.jpg"
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="font-condensed font-bold text-xl text-white">
              {tour.destination}
            </div>
            <div className="font-barlow text-xs text-white/70 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {tour.duration}
            </div>
          </div>
          <div className="text-right">
            <div className="font-condensed font-bold text-brand-orange text-lg">
              {tour.price}
            </div>
            <div className="font-barlow text-xs text-white/60">
              Twin sharing
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="font-condensed font-bold text-2xl text-white mb-2">
          {tour.title}
        </h3>
        <p className="font-barlow text-sm text-brand-muted leading-relaxed mb-4">
          {tour.description}
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {tour.highlights.slice(0, 4).map((h) => (
            <div key={h} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
              <span className="font-barlow text-xs text-brand-muted">{h}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-2 font-condensed font-semibold text-sm uppercase tracking-widest text-brand-orange hover:text-white transition-colors duration-200"
          onClick={() => setExpanded(!expanded)}
          data-ocid="tours.toggle"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> View Full Itinerary
            </>
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-6">
                {/* Itinerary */}
                <div>
                  <h4 className="font-condensed font-bold text-lg text-white uppercase tracking-wide mb-4">
                    Day-by-Day Itinerary
                  </h4>
                  <div className="space-y-3">
                    {tour.itinerary.map((day) => (
                      <div key={Number(day.day)} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
                          <span className="font-condensed font-bold text-xs text-white">
                            {Number(day.day)}
                          </span>
                        </div>
                        <div>
                          <div className="font-condensed font-semibold text-sm text-white">
                            {day.title}
                          </div>
                          <div className="font-barlow text-xs text-brand-muted mt-0.5 leading-relaxed">
                            {day.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions / Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-condensed font-bold text-base text-white uppercase tracking-wide mb-3">
                      Inclusions
                    </h4>
                    <ul className="space-y-2">
                      {tour.inclusions.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="font-barlow text-xs text-brand-muted">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-condensed font-bold text-base text-white uppercase tracking-wide mb-3">
                      Exclusions
                    </h4>
                    <ul className="space-y-2">
                      {tour.exclusions.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="font-barlow text-xs text-brand-muted">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price CTA */}
                <div
                  className="rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                  style={{ backgroundColor: "oklch(0.19 0.045 150)" }}
                >
                  <div>
                    <div className="font-condensed font-bold text-2xl text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-brand-orange" />
                      {tour.price}
                    </div>
                    <div className="font-barlow text-xs text-brand-muted">
                      All inclusive • Limited seats
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .querySelector("#contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="btn-orange flex items-center gap-2"
                    data-ocid="tours.primary_button"
                  >
                    Enquire Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ToursSection() {
  const { data: tours, isLoading } = useGetTours();
  const displayTours = tours && tours.length > 0 ? tours : [SEED_TOUR];

  return (
    <section id="tours" className="py-20 md:py-28 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 block">
            Our Packages
          </span>
          <h2 className="font-condensed font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase">
            Featured Tours
          </h2>
          <p className="font-barlow text-brand-muted mt-4 max-w-xl mx-auto text-base">
            Handpicked marathon experiences with everything taken care of. Just
            lace up and run.
          </p>
        </motion.div>

        {isLoading ? (
          <div
            className="flex justify-center py-16"
            data-ocid="tours.loading_state"
          >
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="font-barlow text-brand-muted text-sm">
            More destinations coming soon. Want a custom tour?{" "}
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-brand-orange underline"
            >
              Get in touch
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

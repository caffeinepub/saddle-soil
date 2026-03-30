import type { Event } from "@/backend";
import { Variant_closed_open_comingSoon } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useGetEvents } from "@/hooks/useQueries";
import { Bell, Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SEED_EVENTS: Event[] = [
  {
    id: "berlin-2026",
    city: "Berlin",
    marathonName: "Berlin Marathon 2026",
    year: BigInt(2026),
    month: "September",
    status: Variant_closed_open_comingSoon.comingSoon,
    description:
      "Run through the heart of Europe's most vibrant capital. The Berlin Marathon is known for its fast, flat course and incredible crowd support.",
  },
  {
    id: "nyc-2026",
    city: "New York",
    marathonName: "TCS New York City Marathon 2026",
    year: BigInt(2026),
    month: "November",
    status: Variant_closed_open_comingSoon.comingSoon,
    description:
      "Five boroughs, two million spectators. The NYC Marathon is the world's largest marathon — an experience unlike any other.",
  },
  {
    id: "chicago-2026",
    city: "Chicago",
    marathonName: "Bank of America Chicago Marathon 2026",
    year: BigInt(2026),
    month: "October",
    status: Variant_closed_open_comingSoon.comingSoon,
    description:
      "One of the six World Marathon Majors. Chicago's flat course through 29 neighbourhoods makes it a favourite for personal bests.",
  },
];

const eventImages: Record<string, string> = {
  Berlin: "/assets/generated/event-berlin.dim_600x400.jpg",
  "New York": "/assets/generated/event-nyc.dim_600x400.jpg",
  Chicago: "/assets/generated/event-chicago.dim_600x400.jpg",
};

const flagEmojis: Record<string, string> = {
  Berlin: "\uD83C\uDDE9\uD83C\uDDEA",
  "New York": "\uD83C\uDDFA\uD83C\uDDF8",
  Chicago: "\uD83C\uDDFA\uD83C\uDDF8",
  Tokyo: "\uD83C\uDDEF\uD83C\uDDF5",
};

function EventCard({ event }: { event: Event }) {
  const { actor } = useActor();
  const [email, setEmail] = useState("");
  const [notifying, setNotifying] = useState(false);
  const [done, setDone] = useState(false);

  const handleNotify = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setNotifying(true);
    try {
      if (actor) await actor.subscribe(email);
      setDone(true);
      setEmail("");
      toast.success("You'll be notified when registration opens!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setNotifying(false);
    }
  };

  const img = eventImages[event.city];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col"
      data-ocid="events.card"
    >
      {img && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={img}
            alt={event.city}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute top-3 right-3 text-xs font-condensed font-bold uppercase tracking-widest bg-brand-orange text-white px-3 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">
            {flagEmojis[event.city] ?? "\uD83C\uDFC3"}
          </span>
          <div>
            <h3 className="font-condensed font-bold text-xl text-brand-text">
              {event.marathonName}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="flex items-center gap-1 font-barlow text-xs"
                style={{ color: "oklch(0.40 0.020 65)" }}
              >
                <MapPin className="w-3 h-3" /> {event.city}
              </span>
              <span
                className="flex items-center gap-1 font-barlow text-xs"
                style={{ color: "oklch(0.40 0.020 65)" }}
              >
                <Calendar className="w-3 h-3" /> {event.month}{" "}
                {Number(event.year)}
              </span>
            </div>
          </div>
        </div>
        <p
          className="font-barlow text-sm leading-relaxed mb-5 flex-1"
          style={{ color: "oklch(0.40 0.020 65)" }}
        >
          {event.description}
        </p>
        {done ? (
          <p className="font-condensed font-semibold text-sm text-brand-green uppercase tracking-wide">
            \u2713 You're on the list!
          </p>
        ) : (
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 font-barlow text-sm border border-border rounded px-3 py-2 bg-white text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-orange"
              data-ocid="events.input"
            />
            <button
              type="button"
              onClick={handleNotify}
              disabled={notifying}
              className="btn-orange text-xs py-2 px-4 flex items-center gap-1 whitespace-nowrap"
              data-ocid="events.primary_button"
            >
              <Bell className="w-3 h-3" />
              {notifying ? "..." : "Notify Me"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function EventsSection() {
  const { data: events, isLoading } = useGetEvents();
  const displayEvents = events && events.length > 0 ? events : SEED_EVENTS;

  return (
    <section id="events" className="py-20 md:py-28 px-4 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 block">
            What's Next
          </span>
          <h2 className="font-condensed font-bold text-4xl md:text-5xl lg:text-6xl text-brand-text uppercase">
            Upcoming Events
          </h2>
          <p
            className="font-barlow mt-4 max-w-xl mx-auto text-base"
            style={{ color: "oklch(0.40 0.020 65)" }}
          >
            Register your interest early. Spots are limited and race entries go
            fast.
          </p>
        </motion.div>

        {isLoading ? (
          <div
            className="flex justify-center py-16"
            data-ocid="events.loading_state"
          >
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

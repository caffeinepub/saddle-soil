import { useActor } from "@/hooks/useActor";
import { CheckCircle, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const { actor } = useActor();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      if (actor) await actor.subscribe(email);
      setDone(true);
      setEmail("");
    } catch {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-24 px-4 bg-brand-green">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Mail className="w-12 h-12 text-brand-orange mx-auto mb-5" />
          <h2 className="font-condensed font-bold text-4xl md:text-5xl text-white uppercase mb-4">
            Stay Updated
          </h2>
          <p className="font-barlow text-brand-muted text-base max-w-lg mx-auto mb-8">
            Be the first to know about new tours, early bird offers, and
            marathon registrations. No spam — just running adventures.
          </p>

          {done ? (
            <div
              className="flex flex-col items-center gap-3"
              data-ocid="newsletter.success_state"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="font-condensed font-bold text-xl text-white">
                You're subscribed! 🏃
              </p>
              <p className="font-barlow text-sm text-brand-muted">
                We'll keep you in the loop.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              data-ocid="newsletter.panel"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 font-barlow text-sm px-5 py-3 rounded-lg border-0 bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                data-ocid="newsletter.input"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-orange flex items-center justify-center gap-2 whitespace-nowrap"
                data-ocid="newsletter.submit_button"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

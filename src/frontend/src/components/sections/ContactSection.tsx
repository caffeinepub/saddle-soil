import type { Inquiry } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { CheckCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { toast } from "sonner";

const marathonOptions = [
  "Tokyo Marathon 2026",
  "Berlin Marathon 2026",
  "New York Marathon 2026",
  "Chicago Marathon 2026",
  "Other",
];

// Hidden: actual delivery address
const DELIVERY_EMAIL = atob("bWJhdHRobTI1MDI1QGlpbXNpcm1hdXIuYWMuaW4=");

export default function ContactSection() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    marathon: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const inquiry: Inquiry = {
        id: crypto.randomUUID(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        marathon: form.marathon,
        message: form.message,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        read: false,
      };
      if (actor) await actor.submitInquiry(inquiry);

      // Forward inquiry to delivery address via mailto
      const subject = encodeURIComponent(
        `New Inquiry from ${form.name} - Saddle & Soil`,
      );
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "—"}\nMarathon: ${form.marathon || "—"}\n\nMessage:\n${form.message}`,
      );
      const mailtoLink = `mailto:${DELIVERY_EMAIL}?subject=${subject}&body=${body}`;
      const a = document.createElement("a");
      a.href = mailtoLink;
      a.click();

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", marathon: "", message: "" });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full font-barlow text-sm px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all duration-200 bg-white text-brand-text placeholder:text-brand-muted border-border";

  const socials = [
    { icon: <SiInstagram size={20} />, label: "Instagram" },
    { icon: <SiFacebook size={20} />, label: "Facebook" },
    { icon: <SiYoutube size={20} />, label: "YouTube" },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 px-4 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 block">
              Get In Touch
            </span>
            <h2 className="font-condensed font-bold text-4xl md:text-5xl lg:text-6xl text-brand-text uppercase leading-tight mb-6">
              Plan Your
              <br />
              <span className="text-brand-green">Adventure</span>
            </h2>
            <p
              className="font-barlow text-base leading-relaxed mb-8"
              style={{ color: "oklch(0.40 0.020 65)" }}
            >
              Ready to run your dream marathon? Fill out the form and our team
              will get back to you within 24 hours with a personalised itinerary
              and pricing.
            </p>
            <div className="space-y-4 mb-10">
              {[
                {
                  icon: "\uD83D\uDCE7",
                  label: "info@saddleandsoil.com",
                  // Clicking opens mail client to actual hidden delivery address
                  href: `mailto:${DELIVERY_EMAIL}`,
                },
                { icon: "\uD83D\uDCF1", label: "+91 80546 71900" },
                { icon: "\uD83D\uDCCD", label: "Delhi, India" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  {"href" in item && item.href ? (
                    <a
                      href={item.href}
                      className="font-barlow text-sm hover:text-brand-orange transition-colors duration-200"
                      style={{ color: "oklch(0.40 0.020 65)" }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className="font-barlow text-sm"
                      style={{ color: "oklch(0.40 0.020 65)" }}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full border-2 border-brand-green/30 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all duration-200"
                  data-ocid="contact.link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {success ? (
              <div
                className="h-full min-h-64 flex flex-col items-center justify-center text-center gap-4 p-10 rounded-xl bg-white shadow-sm"
                data-ocid="contact.success_state"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="font-condensed font-bold text-2xl text-brand-text uppercase">
                  Message Sent!
                </h3>
                <p
                  className="font-barlow text-sm"
                  style={{ color: "oklch(0.40 0.020 65)" }}
                >
                  We'll get back to you within 24 hours with your personalised
                  tour details.
                </p>
                <button
                  type="button"
                  className="btn-orange text-sm py-2"
                  onClick={() => setSuccess(false)}
                  data-ocid="contact.secondary_button"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl p-8 shadow-sm space-y-5"
                data-ocid="contact.panel"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="font-condensed font-semibold text-xs uppercase tracking-wider text-brand-text block mb-1.5"
                    >
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Ravi Sharma"
                      value={form.name}
                      onChange={update("name")}
                      className={inputClass}
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="font-condensed font-semibold text-xs uppercase tracking-wider text-brand-text block mb-1.5"
                    >
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="ravi@example.com"
                      value={form.email}
                      onChange={update("email")}
                      className={inputClass}
                      data-ocid="contact.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="font-condensed font-semibold text-xs uppercase tracking-wider text-brand-text block mb-1.5"
                    >
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 80546 71900"
                      value={form.phone}
                      onChange={update("phone")}
                      className={inputClass}
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-marathon"
                      className="font-condensed font-semibold text-xs uppercase tracking-wider text-brand-text block mb-1.5"
                    >
                      Which Marathon?
                    </label>
                    <select
                      id="contact-marathon"
                      value={form.marathon}
                      onChange={update("marathon")}
                      className={inputClass}
                      data-ocid="contact.select"
                    >
                      <option value="">Select a marathon</option>
                      {marathonOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="font-condensed font-semibold text-xs uppercase tracking-wider text-brand-text block mb-1.5"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us about your running goals and any questions you have..."
                    value={form.message}
                    onChange={update("message")}
                    className={`${inputClass} resize-none`}
                    data-ocid="contact.textarea"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-orange w-full flex items-center justify-center gap-2 text-base"
                  data-ocid="contact.submit_button"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

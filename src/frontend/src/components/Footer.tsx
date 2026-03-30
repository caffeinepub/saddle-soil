import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Tours", href: "#tours" },
  { label: "Gallery", href: "#gallery" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="py-16 px-4"
      style={{ backgroundColor: "oklch(var(--brand-brown))" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logo_saddle_and_soil-019d3e17-6375-7131-aac5-076e3207f094.png"
                alt="Saddle & Soil"
                className="h-12 w-12 object-contain"
              />
              <div>
                <div className="font-condensed font-bold text-xl text-white uppercase tracking-widest">
                  Saddle &amp; Soil
                </div>
                <div className="font-barlow text-[11px] text-brand-muted tracking-[0.2em] uppercase">
                  Beyond the Finish
                </div>
              </div>
            </div>
            <p className="font-barlow text-sm text-brand-muted leading-relaxed max-w-xs">
              Curating extraordinary marathon travel experiences for Indian
              runners at the world's most iconic races.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-condensed font-bold text-base text-white uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className="font-barlow text-sm text-brand-muted hover:text-white transition-colors duration-200"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social */}
          <div>
            <h4 className="font-condensed font-bold text-base text-white uppercase tracking-widest mb-5">
              Follow Us
            </h4>
            <div className="flex gap-4 mb-6">
              {[
                { icon: <SiInstagram size={18} />, label: "Instagram" },
                { icon: <SiFacebook size={18} />, label: "Facebook" },
                { icon: <SiYoutube size={18} />, label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-brand-muted hover:text-white hover:border-brand-orange transition-all duration-200"
                  data-ocid="footer.link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="font-barlow text-xs text-brand-muted">
              Stay connected for tour announcements, running tips, and travel
              inspiration.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-barlow text-sm text-brand-muted">
            © {year} Saddle &amp; Soil. All rights reserved.
          </p>
          <p className="font-barlow text-xs text-brand-muted">
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { GalleryItem } from "@/backend";
import { loadConfig } from "@/config";
import { useGetGalleryItems } from "@/hooks/useQueries";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const PLACEHOLDER_TILES = [
  { label: "Tokyo Race Day", gradient: "from-brand-green to-brand-brown" },
  {
    label: "Berlin Brandenburg Gate",
    gradient: "from-brand-brown to-brand-green",
  },
  {
    label: "NYC Skyline Run",
    gradient: "from-brand-green-dark to-brand-brown",
  },
  { label: "Mt. Fuji Views", gradient: "from-brand-brown to-brand-green-dark" },
  { label: "Medal Moments", gradient: "from-brand-green to-brand-green-dark" },
  { label: "Group Celebrations", gradient: "from-brand-brown to-brand-green" },
  { label: "Race Expo", gradient: "from-brand-green-dark to-brand-green" },
  { label: "City Sightseeing", gradient: "from-brand-green to-brand-brown" },
];

function GalleryTile({ item, url }: { item: GalleryItem; url: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden aspect-square relative group"
      data-ocid="gallery.card"
    >
      <img
        src={url}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
        <div className="p-3 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="font-condensed font-semibold text-sm text-white">
            {item.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function GallerySection() {
  const { data: items, isLoading } = useGetGalleryItems();
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!items || items.length === 0) return;
    loadConfig().then((config) => {
      const map: Record<string, string> = {};
      for (const item of items) {
        map[item.id] =
          `${config.storage_gateway_url}/v1/blob/?blob_hash=${encodeURIComponent(item.blobId)}` +
          `&owner_id=${encodeURIComponent(config.backend_canister_id)}` +
          `&project_id=${encodeURIComponent(config.project_id)}`;
      }
      setUrls(map);
    });
  }, [items]);

  const hasRealItems = items && items.length > 0;

  return (
    <section id="gallery" className="py-20 md:py-28 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-condensed font-semibold text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 block">
            Memories
          </span>
          <h2 className="font-condensed font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase">
            Gallery
          </h2>
          <p className="font-barlow text-brand-muted mt-4 max-w-xl mx-auto text-base">
            Moments captured from the world's greatest marathon stages.
          </p>
        </motion.div>

        {isLoading ? (
          <div
            className="flex justify-center py-16"
            data-ocid="gallery.loading_state"
          >
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : hasRealItems ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items!.map((item) => (
              <GalleryTile
                key={item.id}
                item={item}
                url={urls[item.id] ?? ""}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Placeholder collage */}
            <div className="mb-6 rounded-xl overflow-hidden shadow-xl">
              <img
                src="/assets/generated/gallery-collage.dim_1200x800.jpg"
                alt="Marathon moments collage"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PLACEHOLDER_TILES.map((tile, i) => (
                <motion.div
                  key={tile.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className={`rounded-xl aspect-square bg-gradient-to-br ${tile.gradient} flex items-center justify-center p-4 relative overflow-hidden group`}
                  data-ocid="gallery.card"
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "url('/assets/generated/about-team.dim_800x600.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <span className="font-condensed font-semibold text-xs text-white/80 text-center uppercase tracking-wide relative z-10">
                    {tile.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="text-center font-barlow text-sm text-brand-muted mt-6 opacity-70">
              More photos from our tours will appear here. Ask your admin to
              upload gallery images.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

import type { Event, GalleryItem, Testimonial, Tour } from "@/backend";
import {
  Variant_active_draft,
  Variant_closed_open_comingSoon,
  Variant_video_photo,
} from "@/backend";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadConfig } from "@/config";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddGalleryItem,
  useCreateEvent,
  useCreateTestimonial,
  useCreateTour,
  useDeleteEvent,
  useDeleteTestimonial,
  useDeleteTour,
  useGetEvents,
  useGetGalleryItems,
  useGetInquiries,
  useGetTestimonials,
  useGetTours,
  useIsCallerAdmin,
  useMarkInquiryRead,
  useRemoveGalleryItem,
  useUpdateEvent,
  useUpdateTestimonial,
  useUpdateTour,
} from "@/hooks/useQueries";
import { StorageClient } from "@/utils/StorageClient";
import { getSecretParameter } from "@/utils/urlParams";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useQueryClient } from "@tanstack/react-query";
import {
  Download,
  Eye,
  Link,
  LogOut,
  Mountain,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Auth Gate ────────────────────────────────────────────────────────────────
function AuthGate() {
  const { login, loginStatus, isInitializing } = useInternetIdentity();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(var(--brand-green))" }}
    >
      <div className="bg-white rounded-2xl p-10 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full border-4 border-brand-orange flex items-center justify-center mx-auto mb-6">
          <Mountain className="w-8 h-8 text-brand-orange" />
        </div>
        <h1 className="font-condensed font-bold text-2xl text-brand-text uppercase tracking-wide mb-2">
          Admin Panel
        </h1>
        <p className="font-barlow text-sm text-brand-muted mb-8">
          Saddle &amp; Soil • Secure Access
        </p>
        <button
          type="button"
          onClick={login}
          disabled={isInitializing || loginStatus === "logging-in"}
          className="btn-orange w-full flex items-center justify-center gap-2"
          data-ocid="admin.primary_button"
        >
          {loginStatus === "logging-in" || isInitializing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
              Signing in...
            </>
          ) : (
            "Login with Internet Identity"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Tour Form ────────────────────────────────────────────────────────────────
type TourFormState = {
  title: string;
  destination: string;
  description: string;
  duration: string;
  price: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  itinerary: { day: number; title: string; description: string }[];
};

const emptyTourForm: TourFormState = {
  title: "",
  destination: "",
  description: "",
  duration: "",
  price: "",
  highlights: "",
  inclusions: "",
  exclusions: "",
  itinerary: [{ day: 1, title: "", description: "" }],
};

function tourFormToTour(f: TourFormState, id?: string): Tour {
  return {
    id: id ?? crypto.randomUUID(),
    status: Variant_active_draft.active,
    title: f.title,
    destination: f.destination,
    description: f.description,
    duration: f.duration,
    price: f.price,
    highlights: f.highlights
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    inclusions: f.inclusions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    exclusions: f.exclusions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    itinerary: f.itinerary.map((d) => ({
      day: BigInt(d.day),
      title: d.title,
      description: d.description,
    })),
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  };
}

function tourToForm(t: Tour): TourFormState {
  return {
    title: t.title,
    destination: t.destination,
    description: t.description,
    duration: t.duration,
    price: t.price,
    highlights: t.highlights.join(", "),
    inclusions: t.inclusions.join(", "),
    exclusions: t.exclusions.join(", "),
    itinerary: t.itinerary.map((d) => ({
      day: Number(d.day),
      title: d.title,
      description: d.description,
    })),
  };
}

const inputCls =
  "w-full font-barlow text-sm px-3 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange";
const labelCls =
  "block font-condensed font-semibold text-xs uppercase tracking-wider text-brand-text mb-1";

function TourFormDialog({
  existing,
  onClose,
}: { existing?: Tour; onClose: () => void }) {
  const [form, setForm] = useState<TourFormState>(
    existing ? tourToForm(existing) : emptyTourForm,
  );
  const createTour = useCreateTour();
  const updateTour = useUpdateTour();

  const set =
    (key: keyof Omit<TourFormState, "itinerary">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const setItinerary =
    (i: number, key: "title" | "description") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => {
        const it = [...p.itinerary];
        it[i] = { ...it[i], [key]: e.target.value };
        return { ...p, itinerary: it };
      });

  const addDay = () =>
    setForm((p) => ({
      ...p,
      itinerary: [
        ...p.itinerary,
        { day: p.itinerary.length + 1, title: "", description: "" },
      ],
    }));

  const removeDay = (i: number) =>
    setForm((p) => ({
      ...p,
      itinerary: p.itinerary.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async () => {
    if (!form.title || !form.destination) {
      toast.error("Title and destination are required.");
      return;
    }
    try {
      if (existing) {
        await updateTour.mutateAsync({
          ...tourFormToTour(form, existing.id),
          createdAt: existing.createdAt,
        });
        toast.success("Tour updated!");
      } else {
        await createTour.mutateAsync(tourFormToTour(form));
        toast.success("Tour created!");
      }
      onClose();
    } catch {
      toast.error("Failed to save tour.");
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="admin-field-1" className={labelCls}>
            Title *
          </label>
          <input
            className={inputCls}
            value={form.title}
            onChange={set("title")}
            placeholder="Tokyo Marathon 2026"
          />
        </div>
        <div>
          <label htmlFor="admin-field-2" className={labelCls}>
            Destination *
          </label>
          <input
            className={inputCls}
            value={form.destination}
            onChange={set("destination")}
            placeholder="Tokyo, Japan"
          />
        </div>
        <div>
          <label htmlFor="admin-field-3" className={labelCls}>
            Duration
          </label>
          <input
            className={inputCls}
            value={form.duration}
            onChange={set("duration")}
            placeholder="8 Days / 7 Nights"
          />
        </div>
        <div>
          <label htmlFor="admin-field-4" className={labelCls}>
            Price
          </label>
          <input
            className={inputCls}
            value={form.price}
            onChange={set("price")}
            placeholder="\u20b91,89,000 per person"
          />
        </div>
      </div>
      <div>
        <label htmlFor="admin-field-5" className={labelCls}>
          Description
        </label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.description}
          onChange={set("description")}
        />
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="admin-field-6" className={labelCls}>
            Highlights (comma-separated)
          </label>
          <input
            className={inputCls}
            value={form.highlights}
            onChange={set("highlights")}
            placeholder="Race Bib, Hotel, Guide..."
          />
        </div>
        <div>
          <label htmlFor="admin-field-7" className={labelCls}>
            Inclusions (comma-separated)
          </label>
          <input
            className={inputCls}
            value={form.inclusions}
            onChange={set("inclusions")}
          />
        </div>
        <div>
          <label htmlFor="admin-field-8" className={labelCls}>
            Exclusions (comma-separated)
          </label>
          <input
            className={inputCls}
            value={form.exclusions}
            onChange={set("exclusions")}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="admin-field-9" className={labelCls}>
            Itinerary
          </label>
          <button
            type="button"
            onClick={addDay}
            className="text-xs btn-orange py-1 px-3 flex items-center gap-1"
            data-ocid="admin.secondary_button"
          >
            <Plus className="w-3 h-3" /> Add Day
          </button>
        </div>
        <div className="space-y-3">
          {form.itinerary.map((day, i) => (
            <div
              key={day.day}
              className="border border-border rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-condensed font-bold text-sm text-brand-text">
                  Day {day.day}
                </span>
                <button
                  type="button"
                  onClick={() => removeDay(i)}
                  className="text-destructive hover:opacity-80"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                className={inputCls}
                placeholder="Day title"
                value={day.title}
                onChange={setItinerary(i, "title")}
              />
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                placeholder="Description"
                value={day.description}
                onChange={setItinerary(i, "description")}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="btn-orange w-full"
        onClick={handleSubmit}
        disabled={createTour.isPending || updateTour.isPending}
        data-ocid="admin.submit_button"
      >
        {existing ? "Update Tour" : "Create Tour"}
      </button>
    </div>
  );
}

// ─── Tours Tab ────────────────────────────────────────────────────────────────
function ToursTab() {
  const { data: tours, isLoading } = useGetTours();
  const deleteTour = useDeleteTour();
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div data-ocid="admin.panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-condensed font-bold text-2xl text-brand-text uppercase">
          Tours
        </h2>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="btn-orange flex items-center gap-2 text-sm py-2"
              data-ocid="admin.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Tour
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Tour</DialogTitle>
            </DialogHeader>
            <TourFormDialog onClose={() => setOpenAdd(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-10"
          data-ocid="admin.loading_state"
        >
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !tours || tours.length === 0 ? (
        <p
          className="text-center text-brand-muted py-10 font-barlow"
          data-ocid="admin.empty_state"
        >
          No tours yet. Add one above.
        </p>
      ) : (
        <div className="space-y-3">
          {tours.map((tour, i) => (
            <div
              key={tour.id}
              className="border border-border rounded-xl p-4 flex items-center justify-between gap-4"
              data-ocid={`admin.row.${i + 1}`}
            >
              <div>
                <div className="font-condensed font-bold text-base text-brand-text">
                  {tour.title}
                </div>
                <div className="font-barlow text-xs text-brand-muted mt-0.5">
                  {tour.destination} • {tour.duration} • {tour.price}
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={openEdit && editTour?.id === tour.id}
                  onOpenChange={(o) => {
                    setOpenEdit(o);
                    if (o) setEditTour(tour);
                  }}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded border border-border hover:bg-muted"
                      data-ocid="admin.edit_button"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Tour</DialogTitle>
                    </DialogHeader>
                    {editTour && (
                      <TourFormDialog
                        existing={editTour}
                        onClose={() => {
                          setOpenEdit(false);
                          setEditTour(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded border border-destructive/30 text-destructive hover:bg-destructive/10"
                      data-ocid="admin.delete_button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Tour?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{tour.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteTour
                            .mutateAsync(tour.id)
                            .then(() => toast.success("Tour deleted."))
                            .catch(() => toast.error("Delete failed."))
                        }
                        data-ocid="admin.confirm_button"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────
function GalleryTab() {
  const { data: items, isLoading } = useGetGalleryItems();
  const addItem = useAddGalleryItem();
  const removeItem = useRemoveGalleryItem();
  const { identity } = useInternetIdentity();
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [urls, setUrls] = useState<Record<string, string>>({});

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTitle) {
      toast.error("Please enter a title first.");
      return;
    }
    setUploading(true);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({
        identity: identity ?? undefined,
        host: config.backend_host,
      });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) => {
        toast.loading(`Uploading... ${pct}%`, { id: "upload" });
      });
      toast.dismiss("upload");
      const newItem: GalleryItem = {
        id: crypto.randomUUID(),
        blobId: hash,
        title: uploadTitle,
        order: BigInt(Date.now()),
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        mediaType: file.type.startsWith("video/")
          ? Variant_video_photo.video
          : Variant_video_photo.photo,
      };
      await addItem.mutateAsync(newItem);
      setUploadTitle("");
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Build URLs
  const getUrl = async (item: GalleryItem): Promise<string> => {
    const config = await loadConfig();
    return `${config.storage_gateway_url}/v1/blob/?blob_hash=${encodeURIComponent(item.blobId)}&owner_id=${encodeURIComponent(config.backend_canister_id)}&project_id=${encodeURIComponent(config.project_id)}`;
  };

  const loadUrl = async (item: GalleryItem) => {
    if (urls[item.id]) return;
    const url = await getUrl(item);
    setUrls((p) => ({ ...p, [item.id]: url }));
  };

  return (
    <div data-ocid="admin.panel">
      <h2 className="font-condensed font-bold text-2xl text-brand-text uppercase mb-6">
        Gallery
      </h2>

      {/* Upload */}
      <div className="border border-border rounded-xl p-5 mb-6 space-y-3">
        <h3 className="font-condensed font-semibold text-base text-brand-text">
          Upload New Photo/Video
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Title"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className={`${inputCls} flex-1`}
            data-ocid="admin.input"
          />
        </div>
        <label
          className={`flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-brand-orange transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          data-ocid="admin.dropzone"
        >
          <Upload className="w-5 h-5 text-brand-muted" />
          <span className="font-barlow text-sm text-brand-muted">
            {uploading ? "Uploading..." : "Click to upload image or video"}
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
            data-ocid="admin.upload_button"
          />
        </label>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-10"
          data-ocid="admin.loading_state"
        >
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !items || items.length === 0 ? (
        <p
          className="text-center text-brand-muted py-10 font-barlow"
          data-ocid="admin.empty_state"
        >
          No gallery items yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="relative rounded-xl overflow-hidden aspect-square bg-muted group"
              onMouseEnter={() => loadUrl(item)}
              data-ocid={`admin.item.${i + 1}`}
            >
              {urls[item.id] ? (
                <img
                  src={urls[item.id]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-barlow text-xs text-brand-muted text-center px-2">
                    {item.title}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 bg-destructive rounded-lg text-white"
                      data-ocid="admin.delete_button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove image?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove "{item.title}" from the gallery.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          removeItem
                            .mutateAsync(item.id)
                            .then(() => toast.success("Removed."))
                        }
                        data-ocid="admin.confirm_button"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="font-barlow text-xs text-white truncate">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────
type EventFormState = {
  city: string;
  marathonName: string;
  year: string;
  month: string;
  description: string;
  status: string;
};

const emptyEventForm: EventFormState = {
  city: "",
  marathonName: "",
  year: "2026",
  month: "October",
  description: "",
  status: "comingSoon",
};

function eventFormToEvent(f: EventFormState, id?: string): Event {
  return {
    id: id ?? crypto.randomUUID(),
    city: f.city,
    marathonName: f.marathonName,
    year: BigInt(Number(f.year)),
    month: f.month,
    description: f.description,
    status:
      f.status === "open"
        ? Variant_closed_open_comingSoon.open
        : f.status === "closed"
          ? Variant_closed_open_comingSoon.closed
          : Variant_closed_open_comingSoon.comingSoon,
  };
}

function EventFormDialog({
  existing,
  onClose,
}: { existing?: Event; onClose: () => void }) {
  const [form, setForm] = useState<EventFormState>(
    existing
      ? {
          city: existing.city,
          marathonName: existing.marathonName,
          year: String(Number(existing.year)),
          month: existing.month,
          description: existing.description,
          status:
            existing.status === Variant_closed_open_comingSoon.open
              ? "open"
              : existing.status === Variant_closed_open_comingSoon.closed
                ? "closed"
                : "comingSoon",
        }
      : emptyEventForm,
  );
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const set =
    (key: keyof EventFormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.city || !form.marathonName) {
      toast.error("City and marathon name required.");
      return;
    }
    try {
      if (existing) {
        await updateEvent.mutateAsync(eventFormToEvent(form, existing.id));
        toast.success("Event updated!");
      } else {
        await createEvent.mutateAsync(eventFormToEvent(form));
        toast.success("Event created!");
      }
      onClose();
    } catch {
      toast.error("Failed to save event.");
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="admin-field-10" className={labelCls}>
            City *
          </label>
          <input
            className={inputCls}
            value={form.city}
            onChange={set("city")}
            placeholder="Berlin"
          />
        </div>
        <div>
          <label htmlFor="admin-field-11" className={labelCls}>
            Marathon Name *
          </label>
          <input
            className={inputCls}
            value={form.marathonName}
            onChange={set("marathonName")}
            placeholder="Berlin Marathon 2026"
          />
        </div>
        <div>
          <label htmlFor="admin-field-12" className={labelCls}>
            Month
          </label>
          <select
            className={inputCls}
            value={form.month}
            onChange={set("month")}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="admin-field-13" className={labelCls}>
            Year
          </label>
          <input
            className={inputCls}
            type="number"
            value={form.year}
            onChange={set("year")}
          />
        </div>
        <div>
          <label htmlFor="admin-field-14" className={labelCls}>
            Status
          </label>
          <select
            className={inputCls}
            value={form.status}
            onChange={set("status")}
          >
            <option value="comingSoon">Coming Soon</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="admin-field-15" className={labelCls}>
          Description
        </label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.description}
          onChange={set("description")}
        />
      </div>
      <button
        type="button"
        className="btn-orange w-full"
        onClick={handleSubmit}
        disabled={createEvent.isPending || updateEvent.isPending}
        data-ocid="admin.submit_button"
      >
        {existing ? "Update Event" : "Create Event"}
      </button>
    </div>
  );
}

function EventsTab() {
  const { data: events, isLoading } = useGetEvents();
  const deleteEvent = useDeleteEvent();
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div data-ocid="admin.panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-condensed font-bold text-2xl text-brand-text uppercase">
          Upcoming Events
        </h2>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="btn-orange flex items-center gap-2 text-sm py-2"
              data-ocid="admin.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Event</DialogTitle>
            </DialogHeader>
            <EventFormDialog onClose={() => setOpenAdd(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div
          className="flex justify-center py-10"
          data-ocid="admin.loading_state"
        >
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !events || events.length === 0 ? (
        <p
          className="text-center text-brand-muted py-10 font-barlow"
          data-ocid="admin.empty_state"
        >
          No events yet.
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((ev, i) => (
            <div
              key={ev.id}
              className="border border-border rounded-xl p-4 flex items-center justify-between gap-4"
              data-ocid={`admin.row.${i + 1}`}
            >
              <div>
                <div className="font-condensed font-bold text-base text-brand-text">
                  {ev.marathonName}
                </div>
                <div className="font-barlow text-xs text-brand-muted">
                  {ev.city} • {ev.month} {Number(ev.year)}
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={openEdit && editEvent?.id === ev.id}
                  onOpenChange={(o) => {
                    setOpenEdit(o);
                    if (o) setEditEvent(ev);
                  }}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded border border-border hover:bg-muted"
                      data-ocid="admin.edit_button"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Event</DialogTitle>
                    </DialogHeader>
                    {editEvent && (
                      <EventFormDialog
                        existing={editEvent}
                        onClose={() => {
                          setOpenEdit(false);
                          setEditEvent(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded border border-destructive/30 text-destructive hover:bg-destructive/10"
                      data-ocid="admin.delete_button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Delete "{ev.marathonName}"?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteEvent
                            .mutateAsync(ev.id)
                            .then(() => toast.success("Deleted."))
                        }
                        data-ocid="admin.confirm_button"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────
type TestimonialFormState = {
  name: string;
  city: string;
  marathon: string;
  quote: string;
  rating: number;
  active: boolean;
};

const emptyTestimonialForm: TestimonialFormState = {
  name: "",
  city: "",
  marathon: "",
  quote: "",
  rating: 5,
  active: true,
};

function testimonialFormToTestimonial(
  f: TestimonialFormState,
  id?: string,
): Testimonial {
  return {
    id: id ?? crypto.randomUUID(),
    name: f.name,
    city: f.city,
    marathon: f.marathon,
    quote: f.quote,
    rating: BigInt(f.rating),
    active: f.active,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  };
}

function TestimonialFormDialog({
  existing,
  onClose,
}: { existing?: Testimonial; onClose: () => void }) {
  const [form, setForm] = useState<TestimonialFormState>(
    existing
      ? {
          name: existing.name,
          city: existing.city,
          marathon: existing.marathon,
          quote: existing.quote,
          rating: Number(existing.rating),
          active: existing.active,
        }
      : emptyTestimonialForm,
  );
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();

  const set =
    (key: keyof Omit<TestimonialFormState, "active" | "rating">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.quote) {
      toast.error("Name and quote required.");
      return;
    }
    try {
      if (existing) {
        await update.mutateAsync({
          ...testimonialFormToTestimonial(form, existing.id),
          createdAt: existing.createdAt,
        });
        toast.success("Testimonial updated!");
      } else {
        await create.mutateAsync(testimonialFormToTestimonial(form));
        toast.success("Testimonial added!");
      }
      onClose();
    } catch {
      toast.error("Failed to save.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="admin-field-16" className={labelCls}>
            Name *
          </label>
          <input
            className={inputCls}
            value={form.name}
            onChange={set("name")}
            placeholder="Ravi Sharma"
          />
        </div>
        <div>
          <label htmlFor="admin-field-17" className={labelCls}>
            City
          </label>
          <input
            className={inputCls}
            value={form.city}
            onChange={set("city")}
            placeholder="Mumbai"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="admin-field-18" className={labelCls}>
            Marathon
          </label>
          <input
            className={inputCls}
            value={form.marathon}
            onChange={set("marathon")}
            placeholder="Tokyo Marathon 2024"
          />
        </div>
      </div>
      <div>
        <label htmlFor="admin-field-19" className={labelCls}>
          Quote *
        </label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          value={form.quote}
          onChange={set("quote")}
        />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <label htmlFor="admin-field-20" className={labelCls}>
            Rating (1-5)
          </label>
          <input
            type="number"
            min={1}
            max={5}
            className={`${inputCls} w-20`}
            value={form.rating}
            onChange={(e) =>
              setForm((p) => ({ ...p, rating: Number(e.target.value) }))
            }
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="active"
            checked={form.active}
            onChange={(e) =>
              setForm((p) => ({ ...p, active: e.target.checked }))
            }
            className="w-4 h-4"
          />
          <label
            htmlFor="active"
            className="font-barlow text-sm text-brand-text"
          >
            Active (visible on site)
          </label>
        </div>
      </div>
      <button
        type="button"
        className="btn-orange w-full"
        onClick={handleSubmit}
        disabled={create.isPending || update.isPending}
        data-ocid="admin.submit_button"
      >
        {existing ? "Update" : "Add Testimonial"}
      </button>
    </div>
  );
}

function TestimonialsTab() {
  const { data: testimonials, isLoading } = useGetTestimonials();
  const deleteT = useDeleteTestimonial();
  const [editT, setEditT] = useState<Testimonial | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div data-ocid="admin.panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-condensed font-bold text-2xl text-brand-text uppercase">
          Testimonials
        </h2>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="btn-orange flex items-center gap-2 text-sm py-2"
              data-ocid="admin.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Testimonial</DialogTitle>
            </DialogHeader>
            <TestimonialFormDialog onClose={() => setOpenAdd(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div
          className="flex justify-center py-10"
          data-ocid="admin.loading_state"
        >
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !testimonials || testimonials.length === 0 ? (
        <p
          className="text-center text-brand-muted py-10 font-barlow"
          data-ocid="admin.empty_state"
        >
          No testimonials yet.
        </p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="border border-border rounded-xl p-4 flex items-start justify-between gap-4"
              data-ocid={`admin.row.${i + 1}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-condensed font-bold text-base text-brand-text">
                    {t.name}
                  </span>
                  <span className="font-barlow text-xs text-brand-muted">
                    {t.city} • {t.marathon}
                  </span>
                  {t.active ? (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Hidden
                    </Badge>
                  )}
                </div>
                <p
                  className="font-barlow text-sm mt-1 line-clamp-2"
                  style={{ color: "oklch(0.40 0.020 65)" }}
                >
                  "{t.quote}"
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Dialog
                  open={openEdit && editT?.id === t.id}
                  onOpenChange={(o) => {
                    setOpenEdit(o);
                    if (o) setEditT(t);
                  }}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded border border-border hover:bg-muted"
                      data-ocid="admin.edit_button"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Testimonial</DialogTitle>
                    </DialogHeader>
                    {editT && (
                      <TestimonialFormDialog
                        existing={editT}
                        onClose={() => {
                          setOpenEdit(false);
                          setEditT(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded border border-destructive/30 text-destructive hover:bg-destructive/10"
                      data-ocid="admin.delete_button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Remove testimonial from {t.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteT
                            .mutateAsync(t.id)
                            .then(() => toast.success("Deleted."))
                        }
                        data-ocid="admin.confirm_button"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inquiries Tab ────────────────────────────────────────────────────────────
function InquiriesTab() {
  const { data: inquiries, isLoading } = useGetInquiries();
  const markRead = useMarkInquiryRead();

  const exportCSV = () => {
    if (!inquiries || inquiries.length === 0) return;
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Marathon",
      "Message",
      "Date",
      "Read",
    ];
    const rows = inquiries.map((q) => [
      q.name,
      q.email,
      q.phone,
      q.marathon,
      `"${q.message.replace(/"/g, '""')}"`,
      new Date(Number(q.createdAt / BigInt(1_000_000))).toLocaleDateString(),
      q.read ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-ocid="admin.panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-condensed font-bold text-2xl text-brand-text uppercase">
          Inquiries
        </h2>
        <button
          type="button"
          onClick={exportCSV}
          className="btn-dark flex items-center gap-2 text-sm py-2"
          data-ocid="admin.secondary_button"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      {isLoading ? (
        <div
          className="flex justify-center py-10"
          data-ocid="admin.loading_state"
        >
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !inquiries || inquiries.length === 0 ? (
        <p
          className="text-center text-brand-muted py-10 font-barlow"
          data-ocid="admin.empty_state"
        >
          No inquiries yet.
        </p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((q, i) => (
            <div
              key={q.id}
              className={`border rounded-xl p-5 ${q.read ? "border-border" : "border-brand-orange bg-brand-orange/5"}`}
              data-ocid={`admin.row.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-condensed font-bold text-base text-brand-text">
                      {q.name}
                    </span>
                    {!q.read && (
                      <Badge className="bg-brand-orange text-white text-xs">
                        New
                      </Badge>
                    )}
                    <span className="font-barlow text-xs text-brand-muted">
                      {q.marathon}
                    </span>
                  </div>
                  <div
                    className="font-barlow text-xs mb-2"
                    style={{ color: "oklch(0.40 0.020 65)" }}
                  >
                    {q.email} {q.phone && `• ${q.phone}`}
                  </div>
                  <p
                    className="font-barlow text-sm"
                    style={{ color: "oklch(0.35 0.018 60)" }}
                  >
                    {q.message}
                  </p>
                  <p className="font-barlow text-xs text-brand-muted mt-2">
                    {new Date(
                      Number(q.createdAt / BigInt(1_000_000)),
                    ).toLocaleString()}
                  </p>
                </div>
                {!q.read && (
                  <button
                    type="button"
                    onClick={() => markRead.mutateAsync(q.id)}
                    className="flex items-center gap-1 font-condensed font-semibold text-xs uppercase tracking-wider text-brand-green hover:text-brand-orange transition-colors flex-shrink-0"
                    data-ocid="admin.edit_button"
                  >
                    <Eye className="w-4 h-4" /> Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────
export default function Admin() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const {
    data: isAdmin,
    isLoading: adminLoading,
    refetch: refetchIsAdmin,
  } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const [claiming, setClaiming] = useState(false);

  const claimAdmin = useCallback(async () => {
    const token = getSecretParameter("caffeineAdminToken") || "";
    if (!token) {
      window.location.href = "/";
      return;
    }
    setClaiming(true);
    try {
      if (actor) {
        await actor._initializeAccessControlWithSecret(token);
        await queryClient.invalidateQueries({ queryKey: [] });
        const result = await refetchIsAdmin();
        if (result.data === true) {
          // Successfully became admin, page will re-render
          return;
        }
      }
    } catch (err) {
      console.error("Claim admin error:", err);
    } finally {
      setClaiming(false);
    }
  }, [actor, queryClient, refetchIsAdmin]);

  // Auto-claim admin if token is present and user is logged in but not yet admin
  useEffect(() => {
    const token = getSecretParameter("caffeineAdminToken");
    if (identity && !isAdmin && !adminLoading && !claiming && token && actor) {
      claimAdmin();
    }
  }, [identity, isAdmin, adminLoading, claiming, actor, claimAdmin]);

  if (isInitializing || (identity && adminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-green">
        <div
          className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!identity) return <AuthGate />;

  if (!isAdmin) {
    const hasToken = !!getSecretParameter("caffeineAdminToken");
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-green">
        <div
          className="bg-white rounded-2xl p-10 max-w-sm w-full mx-4 text-center shadow-2xl"
          data-ocid="admin.panel"
        >
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="font-condensed font-bold text-2xl text-brand-text uppercase mb-2">
            Access Denied
          </h2>
          <p className="font-barlow text-sm text-brand-muted mb-6">
            {hasToken
              ? "Admin token detected. Click below to claim admin access."
              : "You don't have admin privileges. Open the deployment link with the admin token first, then return here."}
          </p>
          {hasToken && (
            <button
              type="button"
              onClick={claimAdmin}
              disabled={claiming}
              className="btn-orange w-full flex items-center justify-center gap-2 mb-3"
              data-ocid="admin.claim_button"
            >
              {claiming ? "Claiming..." : "Claim Admin Access"}
            </button>
          )}
          <button
            type="button"
            onClick={clear}
            className="btn-dark w-full flex items-center justify-center gap-2"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-brand-orange" />
              <span className="font-condensed font-bold text-lg text-brand-text uppercase tracking-wide">
                Saddle &amp; Soil
              </span>
            </a>
            <span className="font-barlow text-xs text-brand-muted border-l border-border pl-3">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="font-condensed text-sm text-brand-green hover:text-brand-orange transition-colors flex items-center gap-1"
              data-ocid="admin.link"
            >
              <Link className="w-3.5 h-3.5" /> View Site
            </a>
            <button
              type="button"
              onClick={clear}
              className="font-condensed font-semibold text-sm flex items-center gap-1.5 text-brand-muted hover:text-brand-text transition-colors"
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="tours" className="w-full">
          <TabsList className="mb-8 flex flex-wrap gap-1 h-auto">
            {["tours", "gallery", "events", "testimonials", "inquiries"].map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="font-condensed font-semibold text-sm uppercase tracking-wider"
                  data-ocid="admin.tab"
                >
                  {tab}
                </TabsTrigger>
              ),
            )}
          </TabsList>
          <TabsContent value="tours">
            <ToursTab />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="events">
            <EventsTab />
          </TabsContent>
          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>
          <TabsContent value="inquiries">
            <InquiriesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

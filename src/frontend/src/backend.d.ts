import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Testimonial {
    id: string;
    active: boolean;
    city: string;
    name: string;
    createdAt: Time;
    quote: string;
    rating: bigint;
    marathon: string;
}
export type Time = bigint;
export interface Event {
    id: string;
    status: Variant_closed_open_comingSoon;
    month: string;
    marathonName: string;
    city: string;
    year: bigint;
    description: string;
}
export interface Tour {
    id: string;
    status: Variant_active_draft;
    title: string;
    destination: string;
    duration: string;
    createdAt: Time;
    description: string;
    inclusions: Array<string>;
    highlights: Array<string>;
    exclusions: Array<string>;
    price: string;
    itinerary: Array<{
        day: bigint;
        title: string;
        description: string;
    }>;
}
export interface Subscriber {
    subscribedAt: Time;
    email: string;
}
export interface Inquiry {
    id: string;
    name: string;
    createdAt: Time;
    read: boolean;
    email: string;
    message: string;
    phone: string;
    marathon: string;
}
export interface GalleryItem {
    id: string;
    title: string;
    order: bigint;
    createdAt: Time;
    blobId: string;
    mediaType: Variant_video_photo;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_active_draft {
    active = "active",
    draft = "draft"
}
export enum Variant_closed_open_comingSoon {
    closed = "closed",
    open = "open",
    comingSoon = "comingSoon"
}
export enum Variant_video_photo {
    video = "video",
    photo = "photo"
}
export interface backendInterface {
    /**
     * / Gallery
     */
    addGalleryItem(item: GalleryItem): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Events
     */
    createEvent(event: Event): Promise<string>;
    /**
     * / Testimonials
     */
    createTestimonial(testimonial: Testimonial): Promise<string>;
    /**
     * / Tours
     */
    createTour(tour: Tour): Promise<string>;
    deleteEvent(id: string): Promise<void>;
    deleteTestimonial(id: string): Promise<void>;
    deleteTour(id: string): Promise<void>;
    getActiveTestimonials(): Promise<Array<Testimonial>>;
    /**
     * / User Profile Functions
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvents(): Promise<Array<Event>>;
    getGalleryItems(): Promise<Array<GalleryItem>>;
    getInquiries(): Promise<Array<Inquiry>>;
    getSubscribers(): Promise<Array<Subscriber>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getTour(id: string): Promise<Tour>;
    getTours(): Promise<Array<Tour>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markInquiryRead(id: string): Promise<void>;
    removeGalleryItem(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Inquiries
     */
    submitInquiry(inquiry: Inquiry): Promise<string>;
    /**
     * / Newsletter
     */
    subscribe(email: string): Promise<string>;
    updateEvent(updatedEvent: Event): Promise<void>;
    updateGalleryItem(updatedItem: GalleryItem): Promise<void>;
    updateTestimonial(updatedTestimonial: Testimonial): Promise<void>;
    updateTour(updatedTour: Tour): Promise<void>;
}

import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Order "mo:core/Order";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Tour = {
    id : Text;
    title : Text;
    destination : Text;
    description : Text;
    highlights : [Text];
    itinerary : [{ day : Nat; title : Text; description : Text }];
    inclusions : [Text];
    exclusions : [Text];
    price : Text;
    duration : Text;
    status : {
      #active;
      #draft;
    };
    createdAt : Time.Time;
  };

  type GalleryItem = {
    id : Text;
    title : Text;
    mediaType : { #photo; #video };
    blobId : Text;
    order : Nat;
    createdAt : Time.Time;
  };

  type Event = {
    id : Text;
    city : Text;
    marathonName : Text;
    year : Nat;
    month : Text;
    status : { #comingSoon; #open; #closed };
    description : Text;
  };

  type Testimonial = {
    id : Text;
    name : Text;
    city : Text;
    marathon : Text;
    quote : Text;
    rating : Nat;
    active : Bool;
    createdAt : Time.Time;
  };

  type Inquiry = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    marathon : Text;
    message : Text;
    createdAt : Time.Time;
    read : Bool;
  };

  type Subscriber = {
    email : Text;
    subscribedAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  module Tour {
    public func compare(t1 : Tour, t2 : Tour) : Order.Order {
      Text.compare(t1.id, t2.id);
    };
  };

  module GalleryItem {
    public func compare(g1 : GalleryItem, g2 : GalleryItem) : Order.Order {
      if (g1.order == g2.order) { Text.compare(g1.id, g2.id) } else if (g1.order < g2.order) {
        #less;
      } else { #greater };
    };
  };

  module Event {
    public func compare(e1 : Event, e2 : Event) : Order.Order {
      Text.compare(e1.id, e2.id);
    };
  };

  module Testimonial {
    public func compare(t1 : Testimonial, t2 : Testimonial) : Order.Order {
      Text.compare(t1.id, t2.id);
    };
  };

  module Inquiry {
    public func compare(i1 : Inquiry, i2 : Inquiry) : Order.Order {
      Text.compare(i1.id, i2.id);
    };
  };

  module Subscriber {
    public func compare(s1 : Subscriber, s2 : Subscriber) : Order.Order {
      Text.compare(s1.email, s2.email);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let tours = Map.empty<Text, Tour>();
  let gallery = Map.empty<Text, GalleryItem>();
  let events = Map.empty<Text, Event>();
  let testimonials = Map.empty<Text, Testimonial>();
  let inquiries = Map.empty<Text, Inquiry>();
  let subscribers = Map.empty<Text, Subscriber>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let nextId = Map.empty<Text, Nat>();

  func getNextId(entity : Text) : Nat {
    let current = switch (nextId.get(entity)) {
      case (null) { 1 };
      case (?val) { val };
    };
    nextId.add(entity, current + 1);
    current;
  };

  /// User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Tours
  public shared ({ caller }) func createTour(tour : Tour) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create tours");
    };

    let id = "tour-" # getNextId("tour").toText();
    let newTour : Tour = {
      tour with
      id;
      createdAt = Time.now();
    };
    tours.add(id, newTour);
    id;
  };

  public shared ({ caller }) func updateTour(updatedTour : Tour) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update tours");
    };

    if (tours.get(updatedTour.id) == null) {
      Runtime.trap("Tour not found");
    };
    tours.add(updatedTour.id, updatedTour);
  };

  public shared ({ caller }) func deleteTour(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete tours");
    };

    if (tours.get(id) == null) {
      Runtime.trap("Tour not found");
    };
    tours.remove(id);
  };

  public query ({ caller }) func getTour(id : Text) : async Tour {
    switch (tours.get(id)) {
      case (null) { Runtime.trap("Tour not found") };
      case (?tour) { tour };
    };
  };

  public query ({ caller }) func getTours() : async [Tour] {
    tours.values().toArray().sort();
  };

  /// Gallery
  public shared ({ caller }) func addGalleryItem(item : GalleryItem) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };

    let id = "gallery-" # getNextId("gallery").toText();
    let newItem : GalleryItem = {
      item with
      id;
      createdAt = Time.now();
    };
    gallery.add(id, newItem);
    id;
  };

  public shared ({ caller }) func updateGalleryItem(updatedItem : GalleryItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update gallery items");
    };

    let id = updatedItem.id;
    if (gallery.get(id) == null) {
      Runtime.trap("Gallery item not found");
    };
    gallery.add(id, updatedItem);
  };

  public shared ({ caller }) func removeGalleryItem(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove gallery items");
    };

    if (gallery.get(id) == null) {
      Runtime.trap("Gallery item not found");
    };
    gallery.remove(id);
  };

  public query ({ caller }) func getGalleryItems() : async [GalleryItem] {
    gallery.values().toArray().sort();
  };

  /// Events
  public shared ({ caller }) func createEvent(event : Event) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };

    let id = "event-" # getNextId("event").toText();
    let newEvent : Event = {
      event with
      id;
    };
    events.add(id, newEvent);
    id;
  };

  public shared ({ caller }) func updateEvent(updatedEvent : Event) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };
    let id = updatedEvent.id;

    if (events.get(id) == null) {
      Runtime.trap("Event not found");
    };
    events.add(id, updatedEvent);
  };

  public shared ({ caller }) func deleteEvent(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };

    if (events.get(id) == null) {
      Runtime.trap("Event not found");
    };
    events.remove(id);
  };

  public query ({ caller }) func getEvents() : async [Event] {
    events.values().toArray().sort();
  };

  /// Testimonials
  public shared ({ caller }) func createTestimonial(testimonial : Testimonial) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create testimonials");
    };

    let id = "testimonial-" # getNextId("testimonial").toText();
    let newTestimonial : Testimonial = {
      testimonial with
      id;
      createdAt = Time.now();
    };
    testimonials.add(id, newTestimonial);
    id;
  };

  public shared ({ caller }) func updateTestimonial(updatedTestimonial : Testimonial) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update testimonials");
    };

    let id = updatedTestimonial.id;
    if (testimonials.get(id) == null) {
      Runtime.trap("Testimonial not found");
    };
    testimonials.add(id, updatedTestimonial);
  };

  public shared ({ caller }) func deleteTestimonial(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };

    if (testimonials.get(id) == null) {
      Runtime.trap("Testimonial not found");
    };
    testimonials.remove(id);
  };

  public query ({ caller }) func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray().sort();
  };

  public query ({ caller }) func getActiveTestimonials() : async [Testimonial] {
    testimonials.values().toArray().filter(func(t) { t.active }).sort();
  };

  /// Inquiries
  public shared ({ caller }) func submitInquiry(inquiry : Inquiry) : async Text {
    let id = "inquiry-" # getNextId("inquiry").toText();
    let newInquiry : Inquiry = {
      inquiry with
      id;
      createdAt = Time.now();
      read = false;
    };
    inquiries.add(id, newInquiry);
    id;
  };

  public shared ({ caller }) func markInquiryRead(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can mark inquiries as read");
    };

    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) {
        let updatedInquiry : Inquiry = {
          inquiry with
          read = true;
        };
        inquiries.add(id, updatedInquiry);
      };
    };
  };

  public query ({ caller }) func getInquiries() : async [Inquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray().sort();
  };

  /// Newsletter
  public shared ({ caller }) func subscribe(email : Text) : async Text {
    let newSubscriber : Subscriber = {
      email;
      subscribedAt = Time.now();
    };
    subscribers.add(email, newSubscriber);
    email;
  };

  public query ({ caller }) func getSubscribers() : async [Subscriber] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view subscribers");
    };
    subscribers.values().toArray().sort();
  };
};

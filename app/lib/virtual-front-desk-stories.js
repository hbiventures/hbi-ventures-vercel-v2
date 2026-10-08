export const virtualFrontDeskStories = [
  {
    id: "field-services",
    label: "Plumbing & electrical",
    moment: "At 8:30 p.m., a homeowner finds a local electrician’s website and asks whether the business serves East Point and what to do next.",
    response: "The Virtual Front Desk shares approved service-area and safety information, collects non-sensitive job details, and routes the homeowner to the business’s existing request path or human emergency guidance.",
    potentialValue: "Preserve a high-intent after-hours inquiry, give the owner a more structured request, and reduce repeated service-area questions.",
    measure: "After-hours inquiries, completed service requests, qualified handoffs, and owner response time.",
    boundary: "It does not diagnose electrical or plumbing hazards, dispatch a technician, or promise arrival times.",
  },
  {
    id: "wellness",
    label: "Salon & wellness",
    moment: "A first-time client wants to book but cannot tell which service fits or how to prepare.",
    response: "The Virtual Front Desk explains the business’s approved service differences and preparation guidance, then connects the client to the appropriate existing booking option or team member.",
    potentialValue: "Reduce booking friction, help clients select the right starting point, and give staff fewer repetitive questions to answer.",
    measure: "Service-path selections, booking-path clicks, completed inquiries, and questions that still require staff help.",
    boundary: "It does not provide medical advice, determine suitability, or confirm availability unless an approved connection supports it.",
  },
  {
    id: "events",
    label: "Venue & events",
    moment: "A prospective host is comparing venues and needs to know whether the space may fit the date, guest count, and event type.",
    response: "The Virtual Front Desk answers approved venue questions, gathers the basics, and guides the prospect to the correct tour request, inquiry form, or venue lead.",
    potentialValue: "Create more complete tour requests, reduce early back-and-forth, and help the team focus on prospects who fit the venue’s requirements.",
    measure: "Completed tour requests, intake completeness, qualified handoffs, and time from first question to team follow-up.",
    boundary: "It does not hold a date, quote unapproved pricing, or confirm capacity or availability outside approved information.",
  },
];

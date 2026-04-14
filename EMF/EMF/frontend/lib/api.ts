const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json();
}

// ─── Lead Magnet ───────────────────────────────────────────────────────────────
export interface LeadMagnetPayload {
  name: string;
  email: string;
  goal?: string;
}

export interface LeadMagnetResponse {
  success: boolean;
  message: string;
  diet_plan_url?: string;
}

export const submitLeadMagnet = (data: LeadMagnetPayload) =>
  apiFetch<LeadMagnetResponse>("/lead-magnet", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Book Session ──────────────────────────────────────────────────────────────
export interface BookingPayload {
  name: string;
  phone: string;
  email: string;
  goal?: string;
  preferred_time?: string;
  location?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking_id?: number;
}

export const submitBooking = (data: BookingPayload) =>
  apiFetch<BookingResponse>("/book-session", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Contact ───────────────────────────────────────────────────────────────────
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const submitContact = (data: ContactPayload) =>
  apiFetch<ContactResponse>("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── BMI ───────────────────────────────────────────────────────────────────────
export interface BMIPayload {
  height_cm: number;
  weight_kg: number;
  gender: "male" | "female";
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
}

export interface BMIResponse {
  bmi_value: number;
  category: string;
  calorie_estimate: number;
  protein_grams: number;
  carbs_range: string;
  fats_range: string;
  recommendations: string[];
}

export const calculateBMI = (data: BMIPayload) =>
  apiFetch<BMIResponse>("/calculate-bmi", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Reviews ───────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image_url?: string;
}

export const getReviews = () => apiFetch<Review[]>("/reviews");

// ─── Videos ────────────────────────────────────────────────────────────────────
export interface Video {
  id: number;
  title: string;
  platform: string;
  url: string;
  thumbnail?: string;
}

export const getVideos = () => apiFetch<Video[]>("/videos");

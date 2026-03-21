import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface CreateOrderResponse {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
}

export interface InitiateResponse {
  order_id: string;
  amount: number;
  currency: string;
  key: string;
  member_id: string;
  email: string;
  default_password?: string;
}

export async function initiateJoinAndPay(payload: {
  name: string;
  email: string;
  phone: string;
  plan_id: string;
  gender?: string;
}): Promise<InitiateResponse> {
  const res = await apiClient.post<{ success: boolean; data: InitiateResponse }>(
    "/api/payments/initiate",
    payload
  );
  return res.data.data ?? (res.data as unknown as InitiateResponse);
}

export interface VerifyPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function createOrder(planId: string): Promise<CreateOrderResponse> {
  const res = await apiClient.post<{ success: boolean; data: CreateOrderResponse }>(
    "/api/payments/create-order",
    { plan_id: planId },
    { headers: authHeaders() }
  );
  return res.data.data ?? res.data;
}

export async function verifyPayment(payload: VerifyPaymentPayload): Promise<void> {
  await apiClient.post("/api/payments/verify", payload, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

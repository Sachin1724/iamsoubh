import "server-only";
import { getSupabase, alert } from "@/server/clients";

interface ShiprocketCustomer {
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  landmark?: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

interface OrderRecord {
  id: string;
  order_number: number | null;
  product: string;
  qty: number;
  boxes: number;
  amount_paise: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  landmark: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gift_note?: string | null;
  shiprocket_order_id?: string | null;
}

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Authenticates with Shiprocket API and caches the JWT token.
 * Token typically expires in 10 days; we refresh every 24 hours.
 */
async function getShiprocketToken(): Promise<string | null> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now) {
    return cachedToken;
  }

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v2/console/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Shiprocket] Login failed:", err);
      return null;
    }

    const data = await res.json();
    if (data?.token) {
      cachedToken = data.token;
      // Cache for 24 hours
      tokenExpiresAt = now + 24 * 60 * 60 * 1000;
      return cachedToken;
    }
  } catch (err) {
    console.error("[Shiprocket] Login network error:", err);
  }

  return null;
}

/**
 * Creates an ad-hoc order in Shiprocket.
 * Once created in Shiprocket, Shiprocket Engage sends automatic WhatsApp notifications
 * and allows 1-click AWB generation & courier dispatch.
 */
export async function createShiprocketOrder(order: OrderRecord) {
  const token = await getShiprocketToken();
  if (!token) {
    return { success: false, reason: "SHIPROCKET_NOT_CONFIGURED" };
  }

  const cleanPhone = (order.phone || "").replace(/\D/g, "").slice(-10);
  const cleanPincode = (order.pincode || "").replace(/\D/g, "").slice(0, 6);
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";
  const orderIdentifier = order.order_number ? String(order.order_number) : order.id.slice(0, 8);

  const fullAddress = [order.address, order.landmark].filter(Boolean).join(", ");
  const subTotalInr = Math.round(order.amount_paise / 100);
  const unitPrice = Math.max(1, Math.round(subTotalInr / (order.qty || 1)));

  // Approximate package weight and dimensions
  const boxes = order.boxes || 1;
  const weightKg = Number(Math.max(0.2, 0.35 * boxes).toFixed(2));

  const payload = {
    order_id: `ORD-${orderIdentifier}`,
    order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    pickup_location: pickupLocation,
    billing_customer_name: (order.name || "Customer").trim(),
    billing_last_name: "",
    billing_address: (fullAddress || "Address not provided").slice(0, 250),
    billing_city: order.city || "Bhubaneswar",
    billing_pincode: cleanPincode,
    billing_state: order.state || "Odisha",
    billing_country: "India",
    billing_email: order.email || "orders@iamsoubh.com",
    billing_phone: cleanPhone,
    shipping_is_billing: true,
    order_items: [
      {
        name: `Odia Viral Calendar 2027 (${order.product})`,
        sku: `CAL-2027-${order.product}`,
        units: order.qty || 1,
        selling_price: unitPrice,
      },
    ],
    payment_method: "Prepaid",
    sub_total: subTotalInr,
    length: 25,
    breadth: 20,
    height: Math.min(50, 4 * boxes),
    weight: weightKg,
    comment: order.gift_note ? `Gift Note: ${order.gift_note}` : undefined,
  };

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v2/console/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.status_code === 422) {
      console.error("[Shiprocket] Order creation error:", data);
      await alert(`Shiprocket sync failed for order #${orderIdentifier}: ${JSON.stringify(data?.errors || data?.message || data)}`);
      return { success: false, error: data };
    }

    return {
      success: true,
      shiprocketOrderId: data.order_id,
      shipmentId: data.shipment_id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Shiprocket] Sync request failed:", errorMsg);
    await alert(`Shiprocket sync exception for order #${orderIdentifier}: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Finds an order in Supabase by Razorpay Order ID or UUID and syncs it to Shiprocket.
 * Safe to call multiple times without failing the parent request.
 */
export async function syncOrderToShiprocket(identifier: { razorpayOrderId?: string; orderId?: string }) {
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    // Shiprocket is not configured yet; skip silently
    return;
  }

  try {
    const supabase = getSupabase();
    let query = supabase.from("orders").select("*");

    if (identifier.razorpayOrderId) {
      query = query.eq("razorpay_order_id", identifier.razorpayOrderId);
    } else if (identifier.orderId) {
      query = query.eq("id", identifier.orderId);
    } else {
      return;
    }

    const { data: order, error } = await query.single();
    if (error || !order) {
      console.warn("[Shiprocket] Could not find order to sync:", identifier, error?.message);
      return;
    }

    const result = await createShiprocketOrder(order as unknown as OrderRecord);

    if (result.success && result.shiprocketOrderId) {
      // Store shiprocket reference if the column exists or update metadata
      await supabase
        .from("orders")
        .update({
          courier: "Shiprocket (Pending Pickup)",
        })
        .eq("id", order.id);
    }
  } catch (err) {
    console.error("[Shiprocket] syncOrderToShiprocket error:", err);
  }
}

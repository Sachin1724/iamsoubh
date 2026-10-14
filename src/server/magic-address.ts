import { getRazorpay, getSupabase, alert } from "@/server/clients";

type RzpAddress = {
  name?: string;
  contact?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
};

/**
 * Magic Checkout collects the delivery address inside Razorpay, so the paid
 * order is the only place it exists. Copy it onto our row before anything
 * downstream (Shiprocket, email) reads the order.
 */
export async function pullMagicAddress(razorpayOrderId: string) {
  try {
    const order = (await getRazorpay().orders.fetch(razorpayOrderId)) as unknown as {
      customer_details?: {
        name?: string;
        contact?: string;
        email?: string;
        shipping_address?: RzpAddress;
      };
    };

    const d = order.customer_details;
    const ship = d?.shipping_address;
    if (!ship?.zipcode) return false;

    const address = [ship.line1, ship.line2].filter(Boolean).join(", ").slice(0, 250);
    const phone = (ship.contact ?? d?.contact ?? "").replace(/\D/g, "").slice(-10);

    const patch: Record<string, string> = {};
    if (ship.name || d?.name) patch.name = (ship.name ?? d!.name!).slice(0, 120);
    if (address) patch.address = address;
    if (ship.city) patch.city = ship.city;
    if (ship.state) patch.state = ship.state;
    if (ship.zipcode) patch.pincode = ship.zipcode.replace(/\D/g, "").slice(0, 6);
    if (phone.length === 10) patch.phone = phone;
    if (d?.email) patch.email = d.email;

    const { error } = await getSupabase()
      .from("orders")
      .update(patch)
      .eq("razorpay_order_id", razorpayOrderId);

    if (error) throw new Error(error.message);
    return true;
  } catch (e) {
    // A missing address must not block the payment from being marked paid —
    // it only means fulfilment needs a human.
    await alert(`magic address pull failed for ${razorpayOrderId}: ${String(e)}`);
    return false;
  }
}

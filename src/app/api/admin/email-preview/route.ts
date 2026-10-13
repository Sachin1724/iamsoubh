import { getSupabase } from "@/server/clients";
import { renderOrderEmail, type EmailKind } from "@/server/email";

const SAMPLE = {
  id: "preview",
  name: "Priyanka Das",
  email: "preview@example.com",
  order_number: 42,
  boxes: 3,
  courier: "Delhivery",
  tracking_number: "1234567890123",
  tracking_url: "https://www.delhivery.com/track/package/1234567890123",
};

/**
 * Renders a template in the browser without sending anything.
 *   /api/admin/email-preview?kind=shipped[&order=<uuid>]
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = (url.searchParams.get("kind") ?? "confirmed") as EmailKind;
  const orderId = url.searchParams.get("order");

  let order = SAMPLE;
  if (orderId) {
    const { data } = await getSupabase()
      .from("orders")
      .select("id, name, email, order_number, boxes, courier, tracking_number, tracking_url")
      .eq("id", orderId)
      .single();
    if (data) order = { ...SAMPLE, ...data };
  }

  const { subject, html } = renderOrderEmail(kind, order);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "x-subject": subject },
  });
}

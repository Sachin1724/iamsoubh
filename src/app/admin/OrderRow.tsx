"use client";

import { useState } from "react";

export type QueueOrder = {
  id: string;
  order_number: number | null;
  status: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  boxes: number;
  product: string;
  address: string | null;
  landmark: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gift_note: string | null;
  courier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
};

export function OrderRow({ order }: { order: QueueOrder }) {
  const [status, setStatus] = useState(order.status);
  const [courier, setCourier] = useState(order.courier ?? "");
  const [tracking, setTracking] = useState(order.tracking_number ?? "");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const shipped = status === "shipped";

  const save = async () => {
    if (!tracking.trim()) {
      setNote("Tracking number required");
      return;
    }
    setBusy(true);
    setNote("");
    const res = await fetch("/api/admin/ship", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        courier: courier.trim(),
        trackingNumber: tracking.trim(),
      }),
    });
    const body = await res.json().catch(() => null);
    setBusy(false);
    if (!res.ok) {
      setNote(body?.error ?? "Failed");
      return;
    }
    setStatus("shipped");
    setNote(body?.mail?.sent ? "Saved · email sent" : `Saved · email: ${body?.mail?.reason}`);
  };

  // Prefilled WhatsApp message, so tracking also reaches the buyer where they actually read.
  const wa =
    order.phone &&
    `https://wa.me/${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
      `Namaskar ${order.name?.split(" ")[0] ?? ""}! Your Odia Viral Calendar order #${
        order.order_number ?? ""
      } has shipped. ${courier || "Courier"}: ${tracking}`
    )}`;

  return (
    <div
      className={`rounded-2xl border-2 border-[#1B1B1B] p-4 ${shipped ? "bg-[#E8F3E9]" : "bg-white"}`}
      style={{ boxShadow: "4px 4px 0 0 #1B1B1B" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold tabular-nums">
            #{order.order_number ?? "—"} · {order.name ?? "—"} · {order.boxes} box
            {order.boxes > 1 ? "es" : ""} ({order.product})
          </p>
          <p className="text-sm text-[#4A4642] mt-0.5">
            {[order.address, order.landmark, order.city, order.state, order.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="text-sm text-[#4A4642]">
            {order.phone} · {order.email}
          </p>
          {order.gift_note && (
            <p className="text-sm mt-1 italic text-[#8A1717]">Gift note: {order.gift_note}</p>
          )}
        </div>
        <span
          className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border-2 border-[#1B1B1B] ${
            shipped ? "bg-[#3E9B47]" : "bg-[#E0A526]"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          placeholder="Courier"
          className="px-3 py-2 rounded-lg border-2 border-[#1B1B1B]/30 focus:border-[#1B1B1B] outline-none text-sm w-36"
        />
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Tracking number"
          className="px-3 py-2 rounded-lg border-2 border-[#1B1B1B]/30 focus:border-[#1B1B1B] outline-none text-sm w-56"
        />
        <button
          onClick={save}
          disabled={busy}
          className="text-sm font-bold px-4 py-2 rounded-full bg-[#1B1B1B] text-[#F6EFE2] disabled:opacity-50 cursor-pointer"
        >
          {busy ? "Saving…" : shipped ? "Update tracking" : "Mark packed & shipped"}
        </button>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold px-4 py-2 rounded-full border-2 border-[#1B1B1B] cursor-pointer"
          >
            WhatsApp
          </a>
        )}
        <a
          href={`/invoice/${order.id}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold px-4 py-2 rounded-full border-2 border-[#1B1B1B] cursor-pointer"
        >
          Invoice
        </a>
        {note && <span className="text-sm text-[#4A4642]">{note}</span>}
      </div>
    </div>
  );
}

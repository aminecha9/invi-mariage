interface RSVPRequest {
  name?: unknown;
  guests?: unknown;
  message?: unknown;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_RECIPIENTS = [
  "aminechakroun45@gmail.com",
  "emnabenali0128@gmail.com",
];

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return jsonResponse({ error: "Email service is not configured." }, 503);
  }

  let payload: RSVPRequest;
  try {
    payload = (await request.json()) as RSVPRequest;
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const guests =
    typeof payload.guests === "number" &&
    Number.isInteger(payload.guests) &&
    payload.guests >= 1 &&
    payload.guests <= 5
      ? payload.guests
      : 0;
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !guests) {
    return jsonResponse({ error: "Name and guest count are required." }, 400);
  }

  const recipients = (process.env.RSVP_NOTIFICATION_RECIPIENTS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const to = recipients.length ? recipients : DEFAULT_RECIPIENTS;
  const from = process.env.RESEND_FROM_EMAIL ?? "RSVP <onboarding@resend.dev>";

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Nouvelle confirmation de présence : ${name}`,
      text: [
        "Nouvelle confirmation de présence",
        "",
        `Nom : ${name}`,
        `Nombre de personnes : ${guests}`,
        `Message : ${message || "(aucun message)"}`,
        `Date : ${new Date().toLocaleString("fr-FR")}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Resend rejected RSVP notification:", response.status, details);
    return jsonResponse({ error: "Unable to send notification." }, 502);
  }

  return jsonResponse({ sent: true });
}

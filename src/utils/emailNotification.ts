interface RSVPNotification {
  name: string;
  guests: number;
  message: string;
}

export async function sendRSVPNotification(
  rsvp: RSVPNotification,
): Promise<void> {
  const response = await fetch("/.netlify/functions/notify-rsvp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rsvp),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `RSVP notification failed (${response.status}): ${details || response.statusText}`,
    );
  }
}

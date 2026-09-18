export interface RSVPEntry {
  id: string;
  name: string;
  guests: number;
  message: string;
  timestamp: string; // ISO string
}

const STORAGE_KEY = "engagement_rsvp_submissions";

export function getRSVPs(): RSVPEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RSVPEntry[];
    // Filter out any previous demo items if they existed
    return parsed.filter((item) => !item.id.startsWith("rsvp-demo-"));
  } catch {
    return [];
  }
}

export function saveRSVP(
  name: string,
  guests: number,
  message: string = "",
): RSVPEntry {
  const newEntry: RSVPEntry = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    guests: Math.max(1, guests),
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  const current = getRSVPs();
  const updated = [newEntry, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Trigger storage event for live updates across tabs
  try {
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore in unsupported environments
  }

  return newEntry;
}

export function deleteRSVP(id: string): boolean {
  try {
    const current = getRSVPs();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    return true;
  } catch {
    return false;
  }
}

export function getRSVPSummary() {
  const rsvps = getRSVPs();
  const totalSubmissions = rsvps.length;
  const totalGuestsCount = rsvps.reduce(
    (sum, item) => sum + (Number(item.guests) || 1),
    0,
  );
  const totalWithWishes = rsvps.filter(
    (item) => item.message.trim().length > 0,
  ).length;

  return {
    totalSubmissions,
    totalGuestsCount,
    totalWithWishes,
    rsvps,
  };
}

export function exportRSVPsToCSV(): void {
  const rsvps = getRSVPs();
  const headers = ["الاسم", "عدد الحضور", "رسالة التهنئة", "تاريخ التأكيد"];

  const rows = rsvps.map((entry) => [
    `"${entry.name.replace(/"/g, '""')}"`,
    entry.guests,
    `"${(entry.message || "").replace(/"/g, '""')}"`,
    `"${new Date(entry.timestamp).toLocaleString("ar-EG")}"`,
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `كشف-حضور-زفاف-محمد-أمين-وآمنة-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

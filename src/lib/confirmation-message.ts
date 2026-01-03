import { CURRENT_EVENT_CONFIG } from "@/config/events";

function formatEventDateLong(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`); // avoid timezone rollover
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatEventDateShort(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`); // avoid timezone rollover
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function generateConfirmationMessage(
  name: string | null,
  eventDate: string
): string {
  const formattedDateLong = formatEventDateLong(eventDate);
  const formattedDateShort = formatEventDateShort(eventDate);
  const eventTimeDisplay = CURRENT_EVENT_CONFIG.eventTime.replace(" - ", " – ");

  return `Hey there, your spot at TARE on ${formattedDateLong} is confirmed.

Quick location update for ${formattedDateShort}:
This session will now take place at our larger studio a few blocks from our usual space.

${CURRENT_EVENT_CONFIG.address}
Same time, same format.

Please complete the pre-event form so we can tailor the experience to the group:
tarestudionyc.com/form

📍 ${CURRENT_EVENT_CONFIG.address}

🕐 ${eventTimeDisplay}
Doors open at ${CURRENT_EVENT_CONFIG.doorsOpen}

When you arrive, a team member will guide you up, or you can text ${CURRENT_EVENT_CONFIG.contactName} at ${CURRENT_EVENT_CONFIG.contactPhone}.`;
}


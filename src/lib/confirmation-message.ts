import { CURRENT_EVENT_CONFIG } from "@/config/events";
export function generateConfirmationMessage(name: string | null,eventDate: string): string {
 const first=(name||"").trim().split(/\s+/)[0];
 const date=new Date(`${eventDate}T12:00:00`).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
 return `Hey${first?` ${first}`:" there"}, Chris from TARE here. Your spot on ${date} is confirmed.

This session will be a small home tasting at my place in LIC.

Complete your pre-event form so I can tailor the experience to our group:
https://tarestudionyc.com/form?date=${encodeURIComponent(eventDate)}

${CURRENT_EVENT_CONFIG.address}
${CURRENT_EVENT_CONFIG.eventTime.replace(" - "," – ")} Eastern
Arrive from ${CURRENT_EVENT_CONFIG.doorsOpen}.

When you arrive, text me and I’ll help you up. Let me know if you have any questions!
Chris`;
}
export function personalMessageHref(phone:string,message:string):string {
 const digits=phone.replace(/\D/g,"");const recipient=digits.length===10?`+1${digits}`:`+${digits}`;
 // Apple's Messages uses &body; other SMS handlers use ?body.
 const apple=typeof navigator!=="undefined"&&/iPhone|iPad|Macintosh/.test(navigator.userAgent);
 return `sms:${recipient}${apple?"&":"?"}body=${encodeURIComponent(message)}`;
}

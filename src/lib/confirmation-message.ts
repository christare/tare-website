import { CURRENT_EVENT_CONFIG } from "@/config/events";
export function generateConfirmationMessage(name: string | null,eventDate: string): string {
 const first=(name||"").trim().split(/\s+/)[0];
 const date=new Date(`${eventDate}T12:00:00`).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
 return `Hey${first?` ${first}`:""}, Chris from TARE here. Thanks for reserving a spot on ${date}. I’ll be hosting a small coffee tasting at my home in LIC — looking forward to having you.

A few quick preferences so I can prepare for your visit:
https://tarestudionyc.com/form?date=${encodeURIComponent(eventDate)}

${CURRENT_EVENT_CONFIG.eventTime.replace(" - "," – ")} Eastern
${CURRENT_EVENT_CONFIG.address}
Arrive from ${CURRENT_EVENT_CONFIG.doorsOpen}. Text me when you’re downstairs and I’ll help you up.

Any questions, just reply here.
Chris`;
}
export function personalMessageHref(phone:string,message:string):string {
 const digits=phone.replace(/\D/g,"");const recipient=digits.length===10?`+1${digits}`:`+${digits}`;
 // Apple's Messages uses &body; other SMS handlers use ?body.
 const apple=typeof navigator!=="undefined"&&/iPhone|iPad|Macintosh/.test(navigator.userAgent);
 return `sms:${recipient}${apple?"&":"?"}body=${encodeURIComponent(message)}`;
}

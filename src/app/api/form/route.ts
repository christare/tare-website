import { NextResponse } from "next/server";
import Airtable from "airtable";
export async function POST(request: Request) {
 let input: Record<string, unknown>;
 try {const raw=await request.text();if(raw.length>16000)return NextResponse.json({error:"Please shorten your notes."},{status:413});input=JSON.parse(raw);if(!input||typeof input!=="object"||Array.isArray(input))throw Error();}catch{return NextResponse.json({error:"Invalid form data."},{status:400})}
 const get=(key:string,max=1200)=>typeof input[key]==="string"?(input[key] as string).trim().slice(0,max):"";
 if(get("website"))return NextResponse.json({success:true});
 const name=get("preferredName",80),phone=get("phoneNumber",30),digits=phone.replace(/\D/g,""),normalized=digits.length===11&&digits[0]==="1"?digits.slice(1):digits;
 const eventDate=get("eventDate",10);const parsed=new Date(eventDate+"T12:00:00Z");
 if(!name||!/^\d{10}$/.test(normalized)||!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)||Number.isNaN(parsed.valueOf())||parsed.toISOString().slice(0,10)!==eventDate)return NextResponse.json({error:"Please add your name, US phone number, and tasting date."},{status:400});
 const flavours=Array.isArray(input.flavours)?input.flavours.filter((x):x is string=>typeof x==="string").slice(0,6).map(x=>x.slice(0,80)):[];
 const coffee=[get("coffeeRelationship",160),flavours.length?`Flavours: ${flavours.join(", ")}`:"",get("caffeine",160)?`Caffeine: ${get("caffeine",160)}`:""].filter(Boolean).join("\n");
 try {
 const key=process.env.AIRTABLE_PAT,baseId=process.env.AIRTABLE_GUESTFORM_BASE_ID,tableId=process.env.AIRTABLE_GUESTFORM_TABLE_ID;
 if(!key||!baseId||!tableId)throw Error("Missing guest form configuration");
 const table=new Airtable({apiKey:key}).base(baseId)(tableId);
 // Reuse the existing schema: include the session in Intentions so notes remain dated.
 const fields={"Phone Number":phone,"Phone Normalized":normalized,"Preferred Name":name,"Attending With":get("attendingWith",160),"Coffee Relationship":coffee,"Intentions":`Session: ${eventDate}\n${get("intentions")}`,"Dietary Restrictions":get("dietaryRestrictions"),"Scent Sensitivity":get("scentSensitivity",800)};
 await table.create([{fields}]);
 // No automatic SMS. Chris sends personal messages through the admin composer.
 return NextResponse.json({success:true});
 }catch(error){console.error("Guest preferences could not be saved",error instanceof Error?error.name:"Airtable error");return NextResponse.json({error:"Couldn’t save your preferences. Please try again, or text Chris."},{status:503})}
}

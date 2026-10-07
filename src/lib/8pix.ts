import { z } from 'zod';
export const packages = [
 {id:'starter', name:'Starter', price:25, photos:40, removal:3, dusk:2, revisions:1, turnaround:'24–48 hours', best:'Trial / small listings'},
 {id:'professional', name:'Professional', price:60, photos:100, removal:10, dusk:5, revisions:2, turnaround:'24 hours', best:'Regular workflows'},
 {id:'premium', name:'Premium', price:120, photos:200, removal:20, dusk:10, revisions:2, turnaround:'Priority', best:'Agencies / high volume'},
] as const;
export const socials = [
 {name:'WhatsApp',url:'https://wa.me/254742602830'},
 {name:'Facebook',url:'https://www.facebook.com/share/1bJbVxWGnj/'},
 {name:'Instagram',url:'https://www.instagram.com/idris_kapelo'},
 {name:'TikTok',url:'https://www.tiktok.com/@8.pixel0'},
 {name:'LinkedIn',url:'https://www.linkedin.com/in/8pix-creative-182605209'},
];
export const addons = [['Additional standard / HDR photo','$0.60 / image'],['Day-to-dusk','$3 / image'],['Complex object removal','$3–$8 / image'],['Background replacement','$5–$15 / image'],['Virtual staging','$10–$20 / image'],['Rush delivery','+30%']];
export const requestSchema = z.object({
 package:z.enum(['starter','professional','premium','custom']),
 full_name:z.string().trim().min(2,'Please enter your full name.').max(100),
 company:z.string().trim().max(150),
 email:z.string().trim().email('Please enter a valid email.').max(255),
 phone:z.string().trim().min(7,'Please enter a phone number.').max(30).regex(/^[+\d\s().-]+$/,'Please enter a valid phone number.'),
 photo_count:z.coerce.number().int().min(1).max(10000),
 editing_type:z.enum(['HDR / standard enhancement','Interior editing','Exterior editing','Day-to-dusk','Virtual staging','Mixed / custom workflow']),
 instructions:z.string().trim().max(3000),
 turnaround:z.enum(['24–48 hours','24 hours','Priority','Flexible']),
});
export function validateFiles(files:File[]) {
 if(files.length>201) throw new Error('Please upload up to 200 photos and one reference image, or share a folder link for larger sets.');
 let total=0;
 for(const file of files){total+=file.size;if(file.size>20*1024*1024)throw new Error('Each file must be 20 MB or smaller.');if(!/\.(jpe?g|png|webp|tiff?|dng|cr2|cr3|nef|arw|zip)$/i.test(file.name))throw new Error('Use JPG, PNG, WebP, TIFF, RAW or ZIP files.');}
 if(total>100*1024*1024) throw new Error('Upload up to 100 MB per request, or share a folder link in your instructions.');
}

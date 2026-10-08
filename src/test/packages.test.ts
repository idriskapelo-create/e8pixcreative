import { describe, expect, it } from 'vitest';
import { packages, requestSchema, addons } from '@/lib/8pix';

describe('8pix editing package rules',()=>{
 it('Starter includes 40 photos for $25 with 3 removals, 2 dusk edits and 1 revision',()=>{
  expect(packages[0]).toMatchObject({price:25,photos:40,removal:3,dusk:2,revisions:1,turnaround:'24–48 hours'});
 });
 it('Professional includes 100 photos for $60 with 10 removals, 5 dusk edits and 2 revisions',()=>{
  expect(packages[1]).toMatchObject({price:60,photos:100,removal:10,dusk:5,revisions:2,turnaround:'24 hours'});
 });
 it('Premium includes 200 photos for $120 with 20 removals, 10 dusk edits and 2 revisions',()=>{
  expect(packages[2]).toMatchObject({price:120,photos:200,removal:20,dusk:10,revisions:2,turnaround:'Priority'});
 });
 const request={full_name:'Test Client',company:'Agency',email:'client@example.com',phone:'+254700000000',photo_count:201,editing_type:'Interior editing',instructions:'',turnaround:'24 hours'};
 it('rejects requests exceeding a selected package on the shared server validation',()=>{
  expect(requestSchema.safeParse({...request,package:'premium'}).success).toBe(false);
 });
 it('allows a custom workflow exceeding 200 images',()=>{
  expect(requestSchema.safeParse({...request,package:'custom'}).success).toBe(true);
 });
 it('preserves each requested add-on price',()=>{
  expect(addons.map(a=>a[1])).toEqual(['$0.60 / image','$3 / image','$3–$8 / image','$5–$15 / image','$10–$20 / image','+30%']);
 });
});
import { createServerFn } from '@tanstack/react-start';
import { requestSchema, validateFiles } from './8pix';
export const submitEditingRequest = createServerFn({method:'POST'})
 .inputValidator((input:FormData)=>{
  if(!(input instanceof FormData))throw new Error('Invalid request.');
  const values=requestSchema.parse(Object.fromEntries(input.entries()));
  const photos=input.getAll('photos').filter((f):f is File=>f instanceof File&&f.size>0);
  const references=input.getAll('reference').filter((f):f is File=>f instanceof File&&f.size>0);
  if(references.length>1)throw new Error('Please choose one reference image.');
  validateFiles([...photos,...references]);
  return {values,photos,references};
 })
 .handler(async({data})=>{
  // Public, write-only submission: no arbitrary IDs, paths or client roles accepted.
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const id=crypto.randomUUID();
  const files:{path:string;name:string;kind:string}[]=[];
  try{
   for(const [kind,items] of [['photo',data.photos],['reference',data.references]] as const){
    for(const file of items){
     const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(-120);
     const path=`${id}/${crypto.randomUUID()}-${safeName}`;
     const {error}=await supabaseAdmin.storage.from('editing-uploads').upload(path,file,{contentType:file.type||'application/octet-stream',upsert:false});
     if(error)throw new Error('Photo upload failed. Please try again.');
     files.push({path,name:file.name,kind});
    }
   }
   const {error}=await supabaseAdmin.from('editing_requests').insert({id,...data.values,files});
   if(error)throw new Error('Your request could not be saved. Please try again.');
   return {id};
  }catch(error){
   if(files.length)await supabaseAdmin.storage.from('editing-uploads').remove(files.map(f=>f.path));
   throw error;
  }
 });

CREATE OR REPLACE FUNCTION public.claim_studio_owner() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 DELETE FROM public.user_roles r WHERE r.role='owner' AND NOT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=r.user_id AND lower(u.email)='8pixcreative@gmail.com');
 IF EXISTS(SELECT 1 FROM auth.users u JOIN auth.identities i ON i.user_id=u.id WHERE u.id=auth.uid() AND lower(u.email)='8pixcreative@gmail.com' AND u.email_confirmed_at IS NOT NULL AND i.provider='google' AND lower(i.identity_data->>'email')='8pixcreative@gmail.com' AND i.identity_data->>'email_verified'='true') THEN
  INSERT INTO public.user_roles(user_id,role) VALUES(auth.uid(),'owner') ON CONFLICT DO NOTHING;
 END IF;
 RETURN public.is_studio_owner();
END $$;
DELETE FROM public.user_roles r WHERE r.role='owner' AND NOT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=r.user_id AND lower(u.email)='8pixcreative@gmail.com');
CREATE POLICY "Public views portfolio photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id='portfolio-work');
CREATE POLICY "Owner uploads portfolio photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='portfolio-work' AND public.is_studio_owner() AND (storage.foldername(name))[1]=auth.uid()::text);
CREATE POLICY "Owner deletes portfolio photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='portfolio-work' AND public.is_studio_owner() AND (storage.foldername(name))[1]=auth.uid()::text);
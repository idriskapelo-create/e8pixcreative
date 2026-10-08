CREATE TABLE public.user_roles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 role text NOT NULL CHECK (role = 'owner'),
 UNIQUE(user_id,role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own studio role" ON public.user_roles FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE FUNCTION public.is_studio_owner() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=auth.uid() AND role='owner') $$;
REVOKE ALL ON FUNCTION public.is_studio_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_studio_owner() TO authenticated;
CREATE FUNCTION public.claim_studio_owner() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM auth.users u JOIN auth.identities i ON i.user_id=u.id WHERE u.id=auth.uid() AND lower(u.email)='idriskapelo@gmail.com' AND u.email_confirmed_at IS NOT NULL AND i.provider='google' AND lower(i.identity_data->>'email')='idriskapelo@gmail.com' AND i.identity_data->>'email_verified'='true') THEN
  INSERT INTO public.user_roles(user_id,role) VALUES(auth.uid(),'owner') ON CONFLICT DO NOTHING;
 END IF;
 RETURN public.is_studio_owner();
END $$;
REVOKE ALL ON FUNCTION public.claim_studio_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_studio_owner() TO authenticated;
CREATE TABLE public.portfolio_work (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 owner_id uuid NOT NULL DEFAULT auth.uid(),
 title text NOT NULL CHECK(char_length(title) BETWEEN 1 AND 100),
 category text NOT NULL CHECK(category IN ('Interior','Exterior','Day-to-dusk','Virtual staging','Other')),
 description text NOT NULL DEFAULT '' CHECK(char_length(description)<=1000),
 image_path text NOT NULL CHECK(char_length(image_path)<=300)
);
GRANT SELECT ON public.portfolio_work TO anon;
GRANT SELECT, INSERT, DELETE ON public.portfolio_work TO authenticated;
GRANT ALL ON public.portfolio_work TO service_role;
ALTER TABLE public.portfolio_work ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public completed work" ON public.portfolio_work FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY "Owner publishes work" ON public.portfolio_work FOR INSERT TO authenticated WITH CHECK(public.is_studio_owner() AND owner_id=auth.uid() AND image_path LIKE auth.uid()::text || '/%');
CREATE POLICY "Owner removes work" ON public.portfolio_work FOR DELETE TO authenticated USING(public.is_studio_owner() AND owner_id=auth.uid());
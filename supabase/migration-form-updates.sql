-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- Safe to run more than once (uses IF NOT EXISTS)

alter table testimonials add column if not exists visibility_type text not null default 'full_name';
alter table testimonials add column if not exists results_text text;
alter table testimonials add column if not exists results_amount text;
alter table testimonials add column if not exists relationship_other text;
alter table testimonials add column if not exists impact_area_other text;

-- Refresh PostgREST schema cache (Supabase usually picks this up within seconds)
notify pgrst, 'reload schema';

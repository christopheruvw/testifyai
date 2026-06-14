-- TestifyAI Database Schema
-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  company text,
  role text,
  relationship_type text not null,
  impact_areas text[] not null default '{}',
  experience_text text not null,
  transformation_text text not null,
  three_words text not null,
  generated_short text,
  generated_professional text,
  generated_story text,
  selected_version text not null,
  final_testimonial text not null,
  permission_public boolean not null default false,
  visibility_type text not null default 'full_name',
  photo_url text,
  results_text text,
  results_amount text,
  relationship_other text,
  impact_area_other text,
  status text not null default 'pending'
);

create index if not exists testimonials_created_at_idx on testimonials (created_at desc);
create index if not exists testimonials_status_idx on testimonials (status);
create index if not exists testimonials_permission_public_idx on testimonials (permission_public);

-- Storage bucket for testimonial photos
insert into storage.buckets (id, name, public)
values ('testimonial-photos', 'testimonial-photos', true)
on conflict (id) do nothing;

-- Allow public uploads to testimonial-photos bucket
create policy "Anyone can upload testimonial photos"
on storage.objects for insert
with check (bucket_id = 'testimonial-photos');

create policy "Anyone can view testimonial photos"
on storage.objects for select
using (bucket_id = 'testimonial-photos');

-- Row Level Security
alter table testimonials enable row level security;

-- Drop old policies if re-running this script
drop policy if exists "Anyone can submit testimonials" on testimonials;
drop policy if exists "Anon can submit testimonials" on testimonials;
drop policy if exists "Authenticated users can view testimonials" on testimonials;
drop policy if exists "Authenticated users can update testimonials" on testimonials;
drop policy if exists "Authenticated users can delete testimonials" on testimonials;

-- Public form: anonymous visitors can submit (no read access)
create policy "Anon can submit testimonials"
on testimonials for insert
to anon
with check (true);

-- Admins can also submit if logged in
create policy "Authenticated users can submit testimonials"
on testimonials for insert
to authenticated
with check (true);

-- Only authenticated users can read/update/delete
create policy "Authenticated users can view testimonials"
on testimonials for select
to authenticated
using (true);

create policy "Authenticated users can update testimonials"
on testimonials for update
to authenticated
using (true);

create policy "Authenticated users can delete testimonials"
on testimonials for delete
to authenticated
using (true);

-- Run this in Supabase SQL Editor to fix testimonial submission RLS

alter table testimonials enable row level security;

drop policy if exists "Anyone can submit testimonials" on testimonials;
drop policy if exists "Anon can submit testimonials" on testimonials;
drop policy if exists "Authenticated users can submit testimonials" on testimonials;

-- Allow public form submissions from anonymous users
create policy "Anon can submit testimonials"
on testimonials for insert
to anon
with check (true);

-- Allow logged-in admins to submit too
create policy "Authenticated users can submit testimonials"
on testimonials for insert
to authenticated
with check (true);

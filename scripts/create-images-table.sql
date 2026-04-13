-- Create images table for URL-based image storage
create table if not exists images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table images enable row level security;

-- Allow public read access
create policy "Allow public read"
on images
for select
to public
using (true);

-- Allow public insert
create policy "Allow public insert"
on images
for insert
to public
with check (true);

-- Allow public delete
create policy "Allow public delete"
on images
for delete
to public
using (true);

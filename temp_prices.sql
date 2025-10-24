create table if not exists prices (
  token text primary key,
  price numeric,
  updated_at timestamptz default now()
);

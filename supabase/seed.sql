-- Seed Data for SPAV Pilot Campus

insert into campuses (id, name, city, email_domains, is_active)
values (
  'a0000000-0000-0000-0000-000000000001',
  'School of Planning and Architecture Vijayawada',
  'Vijayawada',
  array['spav.ac.in', 'spav.edu.in', 'gmail.com'],
  true
)
on conflict (id) do nothing;

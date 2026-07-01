-- has_purchased 를 '결제 완료(paid)' 건만 인정하도록 강화
-- Supabase SQL Editor 에서 이 쿼리 그대로 실행하면 됩니다.

create or replace function public.has_purchased(p_course_id text, p_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.orders
    where course_id = p_course_id
      and lower(email) = lower(p_email)
      and status = 'paid'
  );
$$;

grant execute on function public.has_purchased(text, text) to anon, authenticated;

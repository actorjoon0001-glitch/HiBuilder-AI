-- HiBuilder 건축 자사몰 · Supabase schema
--   (orders/reviews 는 기존 결제 연동 유지를 위해 course_id 컬럼명을 그대로 사용하되,
--    값으로는 상품 id 를 저장합니다. leads 는 상담·견적 신청용으로 새로 추가.)
-- Supabase 프로젝트의 SQL Editor에서 이 파일을 한 번만 실행해 주세요.
-- (이미 일부가 생성돼 있다면 안전하게 여러 번 실행 가능하도록 IF NOT EXISTS 사용)

-- =====================================================
-- 1) 상품 리뷰 (course_id 컬럼에 상품 id 저장)
-- =====================================================
create table if not exists public.reviews (
  id          bigserial primary key,
  course_id   text        not null,
  name        text        not null check (char_length(name) between 1 and 40),
  rating      smallint    not null check (rating between 1 and 5),
  text        text        not null check (char_length(text) between 5 and 2000),
  verified    boolean     not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_reviews_course_created
  on public.reviews (course_id, created_at desc);

-- =====================================================
-- 2) 주문 (결제)
-- =====================================================
create table if not exists public.orders (
  id          bigserial primary key,
  order_no    text        not null unique,           -- 외부 노출용 주문번호 (ORD-xxxx)
  course_id   text        not null,
  course_title text       not null,
  name        text        not null,
  email       text        not null,
  phone       text        not null,
  pay_method  text        not null,
  price       integer     not null check (price >= 0),
  status      text        not null default 'pending',  -- pending/paid/refunded
  created_at  timestamptz not null default now()
);

create index if not exists idx_orders_email       on public.orders (email);
create index if not exists idx_orders_course      on public.orders (course_id);
create index if not exists idx_orders_created     on public.orders (created_at desc);

-- =====================================================
-- 3) Row Level Security
-- =====================================================
alter table public.reviews enable row level security;
alter table public.orders  enable row level security;

-- 리뷰: 누구나 읽기 / 익명 insert 허용 (verified=false 로만, name·text 검증)
drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

drop policy if exists "reviews_insert_anon" on public.reviews;
create policy "reviews_insert_anon"
  on public.reviews for insert
  with check (
    verified = false
    and char_length(name) between 1 and 40
    and char_length(text) between 5 and 2000
    and rating between 1 and 5
  );

-- 주문: 익명 insert만 허용 (status='pending'으로). 조회는 서비스 롤만.
drop policy if exists "orders_insert_anon" on public.orders;
create policy "orders_insert_anon"
  on public.orders for insert
  with check (status = 'pending');

-- (의도적으로 orders에 select 정책을 만들지 않음 → 익명 조회 불가)

-- =====================================================
-- 4) 구매 인증 뷰 (이메일로 '구매 확인' 뱃지용)
-- =====================================================
-- 이메일 + course_id 조합으로 구매 여부만 true/false를 알려주는 RPC
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
      and status in ('paid', 'pending')
  );
$$;

grant execute on function public.has_purchased(text, text) to anon, authenticated;

-- =====================================================
-- 5) 상담·견적 신청 (리드)
--    · 주택모델 상담(kind='house'), 시공업체 매칭(kind='partner')
-- =====================================================
create table if not exists public.leads (
  id          bigserial primary key,
  kind        text        not null check (kind in ('house', 'partner')),
  target_id   text,                                   -- 상품 id 또는 업체 id
  target_name text,
  name        text        not null check (char_length(name) between 1 and 40),
  phone       text        not null check (char_length(phone) between 8 and 30),
  region      text,
  message     text        check (message is null or char_length(message) <= 2000),
  status      text        not null default 'new',     -- new/contacted/contracted/closed
  created_at  timestamptz not null default now()
);

create index if not exists idx_leads_created on public.leads (created_at desc);
create index if not exists idx_leads_kind    on public.leads (kind);

alter table public.leads enable row level security;

-- 리드: 익명 insert만 허용(status는 기본값 'new'로만). 조회는 서비스 롤만.
drop policy if exists "leads_insert_anon" on public.leads;
create policy "leads_insert_anon"
  on public.leads for insert
  with check (
    status = 'new'
    and kind in ('house', 'partner')
    and char_length(name) between 1 and 40
    and char_length(phone) between 8 and 30
  );

-- (의도적으로 leads 에 select 정책을 만들지 않음 → 익명 조회 불가)

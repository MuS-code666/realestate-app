-- 不動産管理アプリ用テーブル定義
-- 実行方法：Supabaseダッシュボード > SQL Editor に貼り付けて実行してください

-- gen_random_uuid()を使うための拡張機能（Supabaseでは通常デフォルトで有効）
create extension if not exists pgcrypto;

-- 物件情報を保存するテーブル
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  rent integer not null check (rent >= 0),
  area text not null,
  layout text not null,
  created_at timestamptz not null default now()
);

-- 自分が登録した物件を素早く絞り込めるようにインデックスを作成
create index if not exists properties_user_id_idx on public.properties (user_id);

-- Row Level Security（行単位のアクセス制御）を有効化
alter table public.properties enable row level security;

-- 自分が登録した物件のみ閲覧できる
create policy "自分の物件のみ閲覧可能"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のuser_idとしてのみ物件を登録できる
create policy "自分の物件のみ登録可能"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "自分の物件のみ更新可能"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "自分の物件のみ削除可能"
  on public.properties
  for delete
  using (auth.uid() = user_id);

-- Supabase database schema for TradeJournal
-- Run this in the Supabase SQL editor or via the Supabase CLI.

create table if not exists public.trades (
  id text primary key,
  tradeDate timestamptz not null,
  tradingSession text,
  marketCondition text,
  marketType text,
  symbol text,
  strikePrice numeric,
  optionType text,
  expiryDate timestamptz,
  direction text,
  quantity numeric,
  entryPrice numeric,
  exitPrice numeric,
  partialExits jsonb,
  stopLoss numeric,
  target numeric,
  riskAmount numeric,
  brokerage numeric,
  charges numeric,
  customTags text[],
  entryScore int,
  exitScore int,
  followedPlan boolean,
  earlyEntry boolean,
  lateEntry boolean,
  revengeTrade boolean,
  fomoTrade boolean,
  overtrading boolean,
  emotionBefore text,
  emotionDuring text,
  emotionAfter text,
  emotionNotes text,
  disciplineScore int,
  confidenceLevel int,
  stressLevel int,
  whyTradeTaken text,
  whatWentRight text,
  whatWentWrong text,
  lessonsLearned text,
  repeatableSetup boolean,
  pointsCaptured text,
  rulesFollowed boolean,
  averageEntryPrice numeric,
  averageExitPrice numeric,
  grossPnL numeric,
  netPnL numeric,
  roi numeric,
  rMultiple numeric,
  riskRewardRatio numeric,
  tradeQualityScore numeric,
  winLossStatus text,
  userId text,
  beforeEntryImage text,
  duringTradeImage text,
  exitImage text,
  createdAt timestamptz default now(),
  updatedAt timestamptz default now()
);

create table if not exists public.tags (
  id text primary key,
  name text unique not null,
  createdAt timestamptz default now()
);

create table if not exists public.templates (
  id text primary key,
  templateName text not null,
  templateData jsonb not null,
  createdAt timestamptz default now(),
  updatedAt timestamptz default now()
);

-- Make sure existing tables get any missing columns from older schema versions.
alter table if exists public.trades add column if not exists tradeDate timestamptz not null;
alter table if exists public.trades add column if not exists tradingSession text;
alter table if exists public.trades add column if not exists marketCondition text;
alter table if exists public.trades add column if not exists marketType text;
alter table if exists public.trades add column if not exists symbol text;
alter table if exists public.trades add column if not exists strikePrice numeric;
alter table if exists public.trades add column if not exists optionType text;
alter table if exists public.trades add column if not exists expiryDate timestamptz;
alter table if exists public.trades add column if not exists direction text;
alter table if exists public.trades add column if not exists quantity numeric;
alter table if exists public.trades add column if not exists entryPrice numeric;
alter table if exists public.trades add column if not exists exitPrice numeric;
alter table if exists public.trades add column if not exists partialExits jsonb;
alter table if exists public.trades add column if not exists stopLoss numeric;
alter table if exists public.trades add column if not exists target numeric;
alter table if exists public.trades add column if not exists riskAmount numeric;
alter table if exists public.trades add column if not exists brokerage numeric;
alter table if exists public.trades add column if not exists charges numeric;
alter table if exists public.trades add column if not exists customTags text[];
alter table if exists public.trades add column if not exists entryScore int;
alter table if exists public.trades add column if not exists exitScore int;
alter table if exists public.trades add column if not exists followedPlan boolean;
alter table if exists public.trades add column if not exists earlyEntry boolean;
alter table if exists public.trades add column if not exists lateEntry boolean;
alter table if exists public.trades add column if not exists revengeTrade boolean;
alter table if exists public.trades add column if not exists fomoTrade boolean;
alter table if exists public.trades add column if not exists overtrading boolean;
alter table if exists public.trades add column if not exists emotionBefore text;
alter table if exists public.trades add column if not exists emotionDuring text;
alter table if exists public.trades add column if not exists emotionAfter text;
alter table if exists public.trades add column if not exists emotionNotes text;
alter table if exists public.trades add column if not exists disciplineScore int;
alter table if exists public.trades add column if not exists confidenceLevel int;
alter table if exists public.trades add column if not exists stressLevel int;
alter table if exists public.trades add column if not exists whyTradeTaken text;
alter table if exists public.trades add column if not exists whatWentRight text;
alter table if exists public.trades add column if not exists whatWentWrong text;
alter table if exists public.trades add column if not exists lessonsLearned text;
alter table if exists public.trades add column if not exists repeatableSetup boolean;
alter table if exists public.trades add column if not exists pointsCaptured text;
alter table if exists public.trades add column if not exists rulesFollowed boolean;
alter table if exists public.trades add column if not exists averageEntryPrice numeric;
alter table if exists public.trades add column if not exists averageExitPrice numeric;
alter table if exists public.trades add column if not exists grossPnL numeric;
alter table if exists public.trades add column if not exists netPnL numeric;
alter table if exists public.trades add column if not exists roi numeric;
alter table if exists public.trades add column if not exists rMultiple numeric;
alter table if exists public.trades add column if not exists riskRewardRatio numeric;
alter table if exists public.trades add column if not exists tradeQualityScore numeric;
alter table if exists public.trades add column if not exists winLossStatus text;
alter table if exists public.trades add column if not exists userId text;
alter table if exists public.trades add column if not exists beforeEntryImage text;
alter table if exists public.trades add column if not exists duringTradeImage text;
alter table if exists public.trades add column if not exists exitImage text;
alter table if exists public.trades add column if not exists createdAt timestamptz default now();
alter table if exists public.trades add column if not exists updatedAt timestamptz default now();

alter table if exists public.tags add column if not exists name text unique not null;
alter table if exists public.tags add column if not exists createdAt timestamptz default now();

alter table if exists public.templates add column if not exists templateName text not null;
alter table if exists public.templates add column if not exists templateData jsonb not null;
alter table if exists public.templates add column if not exists createdAt timestamptz default now();
alter table if exists public.templates add column if not exists updatedAt timestamptz default now();

-- If you are using the public anon key, create permissive policies for these tables.
-- If you do not want anonymous access, remove these policies and use authenticated requests.

alter table if exists public.trades enable row level security;
drop policy if exists public_read_write_trades on public.trades;
create policy public_read_write_trades on public.trades
  for all using (true) with check (true);

alter table if exists public.tags enable row level security;
drop policy if exists public_read_write_tags on public.tags;
create policy public_read_write_tags on public.tags
  for all using (true) with check (true);

alter table if exists public.templates enable row level security;
drop policy if exists public_read_write_templates on public.templates;
create policy public_read_write_templates on public.templates
  for all using (true) with check (true);

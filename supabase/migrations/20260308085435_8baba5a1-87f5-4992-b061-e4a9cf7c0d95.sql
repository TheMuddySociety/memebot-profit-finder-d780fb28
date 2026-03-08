
-- Simulation wallets: virtual SOL balance per user wallet
CREATE TABLE public.sim_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  sol_balance numeric NOT NULL DEFAULT 10.0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sim_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sim wallet"
  ON public.sim_wallets FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own sim wallet"
  ON public.sim_wallets FOR INSERT
  WITH CHECK (wallet_address IS NOT NULL AND length(wallet_address) > 30);

CREATE POLICY "Users can update own sim wallet"
  ON public.sim_wallets FOR UPDATE
  USING (true)
  WITH CHECK (wallet_address IS NOT NULL AND length(wallet_address) > 30);

-- Bot configurations per user
CREATE TABLE public.sim_bot_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  bot_type text NOT NULL CHECK (bot_type IN ('sniper', 'dca', 'volume', 'auto')),
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sim_bot_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bot configs"
  ON public.sim_bot_configs FOR ALL
  USING (true)
  WITH CHECK (wallet_address IS NOT NULL AND length(wallet_address) > 30);

-- Simulated trade orders
CREATE TABLE public.sim_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  bot_type text NOT NULL,
  token_address text NOT NULL,
  token_symbol text,
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  sol_amount numeric NOT NULL,
  token_amount numeric NOT NULL,
  price_at_execution numeric NOT NULL,
  current_price numeric,
  pnl_percent numeric,
  status text NOT NULL DEFAULT 'filled' CHECK (status IN ('pending', 'filled', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sim_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sim orders"
  ON public.sim_orders FOR ALL
  USING (true)
  WITH CHECK (wallet_address IS NOT NULL AND length(wallet_address) > 30);

-- Token holdings from simulation
CREATE TABLE public.sim_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  token_address text NOT NULL,
  token_symbol text,
  amount numeric NOT NULL DEFAULT 0,
  avg_buy_price numeric NOT NULL DEFAULT 0,
  total_invested numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wallet_address, token_address)
);

ALTER TABLE public.sim_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sim holdings"
  ON public.sim_holdings FOR ALL
  USING (true)
  WITH CHECK (wallet_address IS NOT NULL AND length(wallet_address) > 30);

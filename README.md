# Chilli 🌶️

Plataforma moderna com SvelteKit, Supabase, Tailwind CSS e DaisyUI.

## Stack

- **Frontend**: SvelteKit + Svelte 5
- **Backend**: Supabase (PostgreSQL + Auth)
- **Estilização**: Tailwind CSS + DaisyUI (tema retro)
- **Linguagem**: TypeScript

## Setup

1. Clone o repositório
2. Instale dependências:
   ```bash
   npm install
   ```
3. Copie `.env.example` para `.env` e preencha as variáveis:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`

4. Configure o Supabase:
   - Crie um projeto no [Supabase](https://supabase.com)
   - **Option A (Recomendado - CLI):**
     ```bash
     supabase link --project-ref <seu-project-ref>
     supabase db push
     ```
     As migrations serão aplicadas automaticamente de `supabase/migrations/`

   - **Option B (Manual - SQL Editor):**
     Copie e execute o SQL abaixo no SQL Editor do Supabase:

```sql
-- ============================================================================
-- MIGRATION: Create profiles table with proper RLS and triggers
-- ============================================================================
-- Tabela de perfis com referência a auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Usuários só veem seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Usuários só editam seu próprio perfil (WITH CHECK previne mutation da ID)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Inserção de perfis (app controla criação, sem trigger)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT
  WITH CHECK (true);

-- Policy 4: Usuários podem deletar seu próprio perfil
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-update de timestamp
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_timestamp();

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email_created ON profiles(email, created_at DESC);
```

5. Verifique se as migrations foram aplicadas corretamente:
   ```sql
   -- Check table structure
   \d profiles

   -- Verify RLS enabled
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE tablename = 'profiles' AND schemaname = 'public';

   -- Check policies exist (should be 4: SELECT, UPDATE, INSERT, DELETE)
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

6. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Rotas

- `/` - Página inicial
- `/login` - Login (email/password)
- `/register` - Registro (com validação de força de senha)
- `/profile` - Perfil do usuário (protegido por JWT)
- `/auth/logout` - Logout (revoga JWT)

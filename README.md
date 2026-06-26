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
   - Execute o SQL abaixo no SQL Editor do Supabase:

```sql
-- Tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuários só veem e editam seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ao criar usuário, automaticamente criar perfil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Rotas

- `/` - Página inicial
- `/login` - Login
- `/register` - Registro
- `/profile` - Perfil do usuário (protegido)
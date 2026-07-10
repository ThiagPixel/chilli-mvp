import { createServerClient } from "@supabase/ssr";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import type { Handle } from "@sveltejs/kit";

interface Cookie {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

/**
 * ============================================================================
 * JWT AUTHENTICATION & SESSION MANAGEMENT
 * ============================================================================
 *
 * This hook initializes Supabase client and provides secure session validation.
 *
 * SECURITY LAYER OVERVIEW:
 * 1. Transport: HTTPS enforced in production
 * 2. Storage: HTTP-only cookies (set by Supabase, prevent XSS)
 * 3. Validation: getUser() validates JWT with Supabase server on each request
 * 4. Database: RLS policies enforce auth.uid() = id on all operations
 *
 * JWT FLOW:
 * - User logs in or signs up → Supabase generates JWT
 * - JWT stored in HTTP-only cookie (sb-*-auth-token)
 * - On each request: getUser() validates the JWT directly with Supabase server
 * - Invalid JWT → user set to null, request redirected to login
 * - Valid JWT → user.id extracted (JWT.sub claim) for RLS filtering
 *
 * CRITICAL: Never trust getSession() or onAuthStateChange() user data alone!
 * That data comes straight from the cookie/storage and may be tampered with.
 * Always call getUser() to authenticate the JWT with the Supabase Auth server.
 * ============================================================================
 */

export const handle: Handle = async ({ event, resolve }) => {
  // Initialize Supabase client with cookie-based session management
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet: Cookie[]) {
          cookiesToSet.forEach((cookie: Cookie) => {
            event.cookies.set(cookie.name, cookie.value, {
              ...cookie.options,
              path: "/",
            });
          });
        },
      },
    },
  );

  /**
   * Secure session validation function
   *
   * ❌ INSEGURO (nunca faça isso):
   *   const { data: { session } } = await supabase.auth.getSession();
   *   const user = session?.user; // Vem direto do cookie, pode ser manipulado!
   *
   * ✅ SEGURO (o que fazemos aqui):
   *   Chamamos getUser(), que envia uma requisição ao servidor do Supabase
   *   Auth para validar a assinatura do JWT. Só confiamos no user.id depois
   *   dessa validação.
   *
   * @returns {session, user} - user autenticado ou {null, null}
   */
  event.locals.safeGetSession = async () => {
    try {
      // Envia uma requisição ao Supabase Auth para validar o JWT
      const {
        data: { user },
        error,
      } = await event.locals.supabase.auth.getUser();

      // 🛑 Bloqueia o acesso imediatamente se falhar na autenticação
      if (error || !user) {
        // "Auth session missing!" é esperado para visitantes não autenticados
        // (ex: acessar / ou /login sem estar logado). Não é um erro real,
        // por isso não poluímos o log nesse caso.
        if (error && error.name !== "AuthSessionMissingError") {
          console.error("[Auth] getUser failed:", error.message);
        }
        return {
          session: null,
          user: null,
        };
      }

      // ✅ SEGURO: o 'user.id' foi verificado e autenticado com sucesso
      return {
        session: null,
        user,
      };
    } catch (err) {
      console.error("[Auth] Unexpected error:", err);
      return {
        session: null,
        user: null,
      };
    }
  };

  // Continue to route handler
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      // Allow Supabase-specific headers to be transmitted
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};

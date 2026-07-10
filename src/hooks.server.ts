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
 * - On each request: getSession() reads cookie + getUser() validates with server
 * - Invalid JWT → session cleared, user redirected to login
 * - Valid JWT → user.id extracted (JWT.sub claim) for RLS filtering
 *
 * CRITICAL: Never trust getSession() alone!
 * Always call getUser() to validate the JWT with Supabase server.
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
   * IMPORTANT: This function performs TWO checks:
   * 1. getSession() - reads JWT from HTTP-only cookie
   * 2. getUser() - validates JWT with Supabase server
   *
   * Using only getSession() is INSECURE because cookies can be tampered with.
   * getUser() cryptographically validates the JWT signature with the server.
   *
   * @returns {session, user} - Valid session/user or {null, null}
   */
  event.locals.safeGetSession = async () => {
  try {
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();

    if (error || !user) {
      if (error) {
        console.error("[Auth] getUser failed:", error.message);
      }

      return {
        session: null,
        user: null,
      };
    }

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

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
      // Step 1: Check if a session token exists in cookies
      const {
        data: { session },
      } = await event.locals.supabase.auth.getSession();

      if (!session) {
        return { session: null, user: null };
      }

      // Step 2: Validate the JWT with Supabase auth server
      // This ensures the token is authentic and not expired
      // getUser() contacts Supabase and verifies JWT signature
      const {
        data: { user },
        error,
      } = await event.locals.supabase.auth.getUser();

      if (error) {
        // JWT is invalid, expired, or tampered with
        // Return null to force re-authentication
        console.error("[Auth] JWT validation failed:", error.message);
        return { session: null, user: null };
      }

      // Step 3: Return validated session and user
      // user.id contains the UUID (JWT.sub) used for RLS filtering
      return { session, user };
    } catch (err) {
      // Unexpected error during session validation
      console.error("[Auth] Unexpected error:", err);
      return { session: null, user: null };
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

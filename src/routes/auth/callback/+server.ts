import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * OAuth callback handler
 * GET /auth/callback?code=...&next=...
 *
 * This endpoint handles OAuth2 authorization code callback from Supabase.
 * It exchanges the authorization code for a valid JWT session.
 *
 * SECURITY:
 * - Code is single-use and expires after 10 minutes
 * - Session is validated with getUser() before redirecting
 * - Prevents code reuse and man-in-the-middle attacks
 */
export const GET: RequestHandler = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/profile";

  // Validate authorization code exists
  if (!code) {
    console.warn("[OAuth] Missing authorization code");
    throw redirect(303, "/login?error=auth_callback_failed");
  }

  // Exchange code for session (creates JWT and sets HTTP-only cookie)
  const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[OAuth] Code exchange failed:", error.message);
    throw redirect(303, "/login?error=auth_callback_failed");
  }

  // Verify the JWT is valid by calling getUser()
  // This validates the JWT signature with Supabase auth server
  // Prevents using tampered or invalid tokens
  const {
    data: { user },
    error: userError,
  } = await locals.supabase.auth.getUser();

  if (userError || !user) {
    console.error("[OAuth] JWT validation failed:", userError?.message);
    throw redirect(303, "/login?error=auth_callback_failed");
  }

  // JWT is valid, redirect to next page (usually /profile)
  throw redirect(303, next);
};

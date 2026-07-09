import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Logout endpoint
 * POST /auth/logout
 *
 * Securely revokes the user's session and clears authentication cookies
 * This invalidates the JWT token on the Supabase server
 */
export const POST: RequestHandler = async ({ locals }) => {
  // Verify user is authenticated before allowing logout
  const { session } = await locals.safeGetSession();
  if (!session) {
    throw redirect(303, "/login");
  }

  // Revoke the JWT session on Supabase server
  const { error } = await locals.supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
  }

  // Redirect to home page after successful logout
  throw redirect(303, "/");
};

import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/profile";

  if (!code) {
    throw redirect(303, "/login?error=auth_callback_failed");
  }

  const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw redirect(303, "/login?error=auth_callback_failed");
  }

  // Verify the session is authentic by calling getUser()
  // This ensures the user data is validated by Supabase auth server
  const { error: userError } = await locals.supabase.auth.getUser();

  if (userError) {
    throw redirect(303, "/login?error=auth_callback_failed");
  }

  throw redirect(303, next);
};

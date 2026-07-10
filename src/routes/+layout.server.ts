import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, depends }) => {
  // Declare dependency so client-side invalidate('supabase:auth') actually
  // triggers this load function to re-run (e.g. after login/logout).
  depends("supabase:auth");

  // safeGetSession() validates user with getUser() to ensure authenticity
  // user data returned here has been verified by Supabase auth server
  const { session, user } = await locals.safeGetSession();
  return { session, user };
};

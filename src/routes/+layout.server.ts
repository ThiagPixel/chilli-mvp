import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  // safeGetSession() validates user with getUser() to ensure authenticity
  // user data returned here has been verified by Supabase auth server
  const { session, user } = await locals.safeGetSession();
  return { session, user };
};

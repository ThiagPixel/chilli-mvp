import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // safeGetSession() validates user with getUser() to ensure authenticity
  const { session } = await locals.safeGetSession();
  if (session) {
    throw redirect(303, "/profile");
  }
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return fail(400, { email, error: "Preencha todos os campos" });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { email, error: "Email inválido" });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return fail(400, { email, error: error.message });
    }

    throw redirect(303, "/profile");
  },
};

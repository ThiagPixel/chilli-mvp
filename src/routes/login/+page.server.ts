import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect already logged-in users to profile
  const { user } = await locals.safeGetSession();
  if (user) {
    throw redirect(303, "/profile");
  }
};

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
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
      // Handle specific login errors
      if (error.message.includes("Invalid login credentials")) {
        return fail(400, {
          email,
          error: "Email ou senha inválidos",
        });
      }
      if (error.message.includes("Email not confirmed")) {
        return fail(400, {
          email,
          error: "Email não confirmado. Verifique sua caixa de entrada.",
        });
      }
      return fail(400, {
        email,
        error: error.message || "Erro ao fazer login",
      });
    }

    throw redirect(303, "/profile");
  },
};

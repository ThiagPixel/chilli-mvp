import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
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
    const fullName = formData.get("full_name") as string;

    if (!email || !password || !fullName) {
      return fail(400, {
        email,
        full_name: fullName,
        error: "Preencha todos os campos",
      });
    }

    if (password.length < 6) {
      return fail(400, {
        email,
        full_name: fullName,
        error: "A senha deve ter pelo menos 6 caracteres",
      });
    }

    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return fail(400, { email, full_name: fullName, error: error.message });
    }

    if (data.user) {
      // Upsert para evitar conflito com trigger SQL (se existir)
      await locals.supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: email,
          full_name: fullName,
        },
        { onConflict: "id" },
      );
    }

    throw redirect(303, "/profile");
  },
};

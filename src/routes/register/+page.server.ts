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
    const fullName = formData.get("full_name") as string;

    if (!email || !password || !fullName) {
      return fail(400, {
        email,
        full_name: fullName,
        error: "Preencha todos os campos",
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        email,
        full_name: fullName,
        error: "Email inválido",
      });
    }

    if (password.length < 8) {
      return fail(400, {
        email,
        full_name: fullName,
        error: "A senha deve ter pelo menos 8 caracteres",
      });
    }

    // Validate password strength: at least one uppercase, one lowercase, one number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return fail(400, {
        email,
        full_name: fullName,
        error:
          "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
      });
    }

    if (fullName.trim().length < 3) {
      return fail(400, {
        email,
        full_name: fullName,
        error: "Nome deve ter pelo menos 3 caracteres",
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
      // Handle specific signup errors
      if (error.message.includes("already registered")) {
        return fail(400, {
          email,
          full_name: fullName,
          error: "Email já cadastrado. Faça login ou use outro email.",
        });
      }
      return fail(400, {
        email,
        full_name: fullName,
        error: error.message || "Erro ao criar conta",
      });
    }

    if (data.user) {
      // Insert profile after signup
      // The app controls profile creation (no database trigger)
      const { error: profileError } = await locals.supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
        });

      if (profileError) {
        // Log error but don't expose to user (profile creation failed)
        console.error("Profile creation error:", profileError);
        return fail(500, {
          email,
          full_name: fullName,
          error: "Erro ao criar perfil. Por favor, tente novamente.",
        });
      }
    }

    throw redirect(303, "/profile");
  },
};

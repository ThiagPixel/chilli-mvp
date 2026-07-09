import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

interface ProfileUpdate {
  full_name: string;
  bio: string | null;
  updated_at: string;
}

export const load: PageServerLoad = async ({ locals }) => {
  // safeGetSession() validates user with getUser() to ensure authenticity
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    throw redirect(303, "/login");
  }

  const { data: profile } = await locals.supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { profile };
};

export const actions: Actions = {
  update: async ({ request, locals }) => {
    // safeGetSession() validates user with getUser() to ensure authenticity
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      throw redirect(303, "/login");
    }

    const formData = await request.formData();
    const fullName = formData.get("full_name") as string;
    const bio = formData.get("bio") as string;

    if (!fullName) {
      return fail(400, { error: "Nome é obrigatório" });
    }

    const { error } = await locals.supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio: bio || null,
        updated_at: new Date().toISOString(),
      } as ProfileUpdate)
      .eq("id", user.id);

    if (error) {
      return fail(500, { error: "Erro ao atualizar perfil" });
    }

    return { success: true };
  },

  updatePassword: async ({ request, locals }) => {
    // safeGetSession() validates user with getUser() to ensure authenticity
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      throw redirect(303, "/login");
    }

    const formData = await request.formData();
    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { passwordError: "Preencha todos os campos" });
    }

    if (newPassword.length < 6) {
      return fail(400, {
        passwordError: "Nova senha deve ter pelo menos 6 caracteres",
      });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { passwordError: "As senhas não coincidem" });
    }

    const { error } = await locals.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return fail(400, { passwordError: error.message });
    }

    return { passwordSuccess: true };
  },
};

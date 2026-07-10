import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      throw redirect(303, "/login");
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!name) {
      return fail(400, {
        message: "O nome da mesa é obrigatório.",
      });
    }

    const { data, error } = await locals.supabase
      .from("rpg_tables")
      .insert({
        name,
        description,
        master_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      return fail(500, {
        message: "Erro ao criar mesa.",
      });
    }

    throw redirect(303, `/tables/${data.id}`);
  },
};
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, "/login");
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      throw redirect(303, "/login");
    }

    const formData = await request.formData();

    const inviteCode = String(formData.get("invite_code") || "")
      .trim()
      .toUpperCase();

    const displayName = String(formData.get("display_name") || "").trim();

    if (!inviteCode) {
      return fail(400, {
        message: "Informe o código da mesa.",
      });
    }

    const { data: tableId, error } = await locals.supabase.rpc(
      "join_rpg_table_by_invite_code",
      {
        p_invite_code: inviteCode,
        p_display_name: displayName || null,
      }
    );

    if (error) {
      console.error("[Join Table Error]", error);

      return fail(400, {
        message: error.message || "Erro ao entrar na mesa.",
      });
    }

    throw redirect(303, `/tables/${tableId}`);
  },
};
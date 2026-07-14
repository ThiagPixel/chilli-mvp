import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

interface TableMember {
  id: string;
  user_id: string;
  role: "master" | "player";
  display_name: string | null;
  joined_at: string;
}

interface RpgTable {
  id: string;
  name: string;
  description: string | null;
  master_id: string;
  invite_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const load: PageServerLoad = async ({ params, locals }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, "/login");
  }

  const tableId = params.id;

  const { data: membership, error: membershipError } = await locals.supabase
    .from("rpg_table_members")
    .select("id, role, display_name, joined_at, user_id, table_id")
    .eq("table_id", tableId)
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership) {
    console.error("[Membership Error]", membershipError);
    throw error(403, "Você não participa desta mesa.");
  }

  const { data: table, error: tableError } = await locals.supabase
    .from("rpg_tables")
    .select(`
      id,
      name,
      description,
      master_id,
      invite_code,
      is_active,
      created_at,
      updated_at
    `)
    .eq("id", tableId)
    .single();

  if (tableError || !table) {
    console.error("[Table Error]", tableError);
    throw error(404, "Mesa não encontrada.");
  }

  const { data: members, error: membersError } = await locals.supabase
    .from("rpg_table_members")
    .select(`
      id,
      user_id,
      role,
      display_name,
      joined_at
    `)
    .eq("table_id", tableId)
    .order("joined_at", { ascending: true });

  if (membersError) {
    console.error("[Members Error]", membersError);
  }

  return {
    table: table as RpgTable,
    membership: membership as TableMember,
    members: (members ?? []) as TableMember[],
    currentUserId: user.id,
  };
};

export const actions: Actions = {
  updateTable: async ({ request, params, locals }) => {
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

    const { data: membership, error: membershipError } = await locals.supabase
      .from("rpg_table_members")
      .select("role")
      .eq("table_id", params.id)
      .eq("user_id", user.id)
      .single();

    if (membershipError || !membership) {
      return fail(403, {
        message: "Você não participa desta mesa.",
      });
    }

    const membershipTyped = membership as TableMember;

    if (membershipTyped.role !== "master") {
      return fail(403, {
        message: "Apenas o mestre pode editar a mesa.",
      });
    }

    const updateData = {
      name,
      description,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await locals.supabase
      .from("rpg_tables")
      .update(updateData as never)
      .eq("id", params.id);

    if (updateError) {
      console.error("[Update Table Error]", updateError);

      return fail(500, {
        message: "Erro ao atualizar mesa.",
      });
    }

    return {
      message: "Mesa atualizada com sucesso.",
    };
  },

  deleteTable: async ({ params, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      throw redirect(303, "/login");
    }

    const { data: membership, error: membershipError } = await locals.supabase
      .from("rpg_table_members")
      .select("role")
      .eq("table_id", params.id)
      .eq("user_id", user.id)
      .single();

    if (membershipError || !membership) {
      return fail(403, {
        message: "Você não participa desta mesa.",
      });
    }

    const membershipTyped = membership as TableMember;

    if (membershipTyped.role !== "master") {
      return fail(403, {
        message: "Apenas o mestre pode deletar a mesa.",
      });
    }

    const { error: deleteError } = await locals.supabase
      .from("rpg_tables")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      console.error("[Delete Table Error]", deleteError);

      return fail(500, {
        message: "Erro ao deletar mesa.",
      });
    }

    throw redirect(303, "/tables");
  },
};
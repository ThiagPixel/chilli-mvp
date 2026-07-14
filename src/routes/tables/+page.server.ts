import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

interface MembershipWithTable {
  id: string;
  role: string;
  display_name: string | null;
  joined_at: string;
  rpg_tables: {
    id: string;
    name: string;
    description: string | null;
    master_id: string;
    invite_code: string;
    is_active: boolean;
    created_at: string;
  } | null;
}

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, "/login");
  }

  const { data, error } = await locals.supabase
    .from("rpg_table_members")
    .select(`
      id,
      role,
      display_name,
      joined_at,
      rpg_tables (
        id,
        name,
        description,
        master_id,
        invite_code,
        is_active,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  if (error) {
    console.error("[List Tables Error]", error);

    return {
      tables: [],
      message: "Erro ao carregar suas mesas.",
    };
  }

  const tables = (data as MembershipWithTable[] | null ?? []).map((membership) => {
    const table = Array.isArray(membership.rpg_tables)
      ? membership.rpg_tables[0]
      : membership.rpg_tables;

    return {
      membership_id: membership.id,
      role: membership.role,
      display_name: membership.display_name,
      joined_at: membership.joined_at,
      table,
    };
  });

  return {
    tables,
    message: null,
  };
};
<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import DiceRoller from "./DiceRoller.svelte";
	import RollHistory from "./RollHistory.svelte";
	import type { RealtimeChannel } from "@supabase/supabase-js";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { RollResult } from "$lib/dice/roller";

	interface RollEntry {
		id: string;
		characterName: string;
		playerName: string;
		result: RollResult;
		createdAt: Date;
	}

	interface Props {
		tableId: string;
		currentUserId: string;
		characterName?: string;
		supabase: SupabaseClient;
	}

	let { tableId, currentUserId, characterName = "", supabase }: Props = $props();

	let rolls = $state<RollEntry[]>([]);
	let channel: RealtimeChannel | null = $state(null);

	onMount(async () => {
		// Carregar rolagens iniciais
		const { data } = await supabase
			.from("table_rolls")
			.select("*, profiles(*)")
			.eq("table_id", tableId)
			.order("created_at", { ascending: false })
			.limit(20);

		if (data) {
			rolls = (data as Array<{
				id: string;
				character_name: string | null;
				expression: string;
				result: number;
				rolls: Array<{ die: number; value: number; exploded?: boolean }>;
				created_at: string;
				profiles?: { full_name: string | null; email: string };
			}>).map((r) => ({
				id: r.id,
				characterName: r.character_name ?? "",
				playerName: r.profiles?.full_name ?? r.profiles?.email ?? "Usuário",
				result: {
					expression: r.expression,
					total: r.result,
					dice: r.rolls.map((d) => ({
						die: d.die,
						value: d.value,
						exploded: d.exploded ?? false,
					})),
					modifier: 0,
					createdAt: new Date(r.created_at),
				},
				createdAt: new Date(r.created_at),
			}));
		}

		// Inscrever no realtime
		channel = supabase
			.channel(`rolls:${tableId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "table_rolls",
					filter: `table_id=eq.${tableId}`,
				},
				async (payload) => {
					const p = payload.new as {
						id: string;
						user_id: string;
						character_name: string | null;
						expression: string;
						result: number;
						rolls: Array<{ die: number; value: number; exploded?: boolean }>;
						created_at: string;
					};

					const { data: profile } = await supabase
						.from("profiles")
						.select("full_name, email")
						.eq("id", p.user_id)
						.single();

					const entry: RollEntry = {
						id: p.id,
						characterName: p.character_name ?? "",
						playerName: profile?.full_name ?? profile?.email ?? "Usuário",
						result: {
							expression: p.expression,
							total: p.result,
							dice: p.rolls.map((d) => ({
								die: d.die,
								value: d.value,
								exploded: d.exploded ?? false,
							})),
							modifier: 0,
							createdAt: new Date(p.created_at),
						},
						createdAt: new Date(p.created_at),
					};

					rolls = [entry, ...rolls].slice(0, 20);
				}
			)
			.subscribe();
	});

	onDestroy(() => {
		channel?.unsubscribe();
	});

	async function handleRoll(result: RollResult, charName: string) {
		const { error } = await supabase.from("table_rolls").insert({
			table_id: tableId,
			user_id: currentUserId,
			character_name: charName || null,
			expression: result.expression,
			result: result.total,
			rolls: result.dice,
		});

		if (error) {
			console.error("[DicePanel] Erro ao salvar rolagem:", error);
		}
	}
</script>

<div class="space-y-3">
	<DiceRoller {characterName} onRoll={handleRoll} />

	<div class="border-t border-white/10 pt-3">
		<h4 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 8v4l3 3"></path>
				<circle cx="12" cy="12" r="10"></circle>
			</svg>
			Histórico
		</h4>
		<RollHistory {rolls} maxItems={10} />
	</div>
</div>

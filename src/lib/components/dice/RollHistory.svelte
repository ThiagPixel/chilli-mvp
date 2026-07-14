<script lang="ts">
	import type { RollResult } from "$lib/dice/roller";

	interface RollEntry {
		id: string;
		characterName: string;
		playerName: string;
		result: RollResult;
		createdAt: Date;
	}

	interface Props {
		rolls: RollEntry[];
		maxItems?: number;
	}

	let { rolls, maxItems = 20 }: Props = $props();

	function formatTime(date: Date): string {
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diff < 60) return "agora";
		if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
		if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
		return date.toLocaleDateString("pt-BR");
	}
</script>

<div class="flex flex-col gap-2">
	{#if rolls.length === 0}
		<p class="py-4 text-center text-sm text-zinc-500">Nenhuma rolagem ainda</p>
	{:else}
		<div class="max-h-48 space-y-2 overflow-y-auto">
			{#each rolls.slice(0, maxItems) as entry (entry.id)}
				<div class="flex items-start gap-2 rounded bg-zinc-800/50 p-2 text-sm">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span class="font-semibold text-zinc-200">{entry.characterName || entry.playerName}</span>
							<span class="text-xs text-zinc-500">{formatTime(entry.createdAt)}</span>
						</div>
						<p class="mt-0.5 font-mono text-zinc-400">
							{entry.result.expression}
						</p>
					</div>
					<div class="flex flex-col items-end">
						<span class="text-xl font-bold text-primary">{entry.result.total}</span>
						<span class="text-xs text-zinc-500">
							[{entry.result.dice.map((d) => d.value).join("] [")}]
						</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

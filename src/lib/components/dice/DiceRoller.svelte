<script lang="ts">
	import { roll, formatRollResult, type RollResult } from "$lib/dice/roller";
	import { validateExpression } from "$lib/dice/parser";

	interface Props {
		characterName?: string;
		onRoll?: (result: RollResult, characterName: string) => void;
	}

	let { characterName = "", onRoll }: Props = $props();

	let expression = $state("");
	let error = $state<string | null>(null);
	let isRolling = $state(false);

	function handleRoll() {
		error = null;

		if (!expression.trim()) {
			error = "Digite uma expressão";
			return;
		}

		const validation = validateExpression(expression);
		if (validation) {
			error = validation.message;
			return;
		}

		isRolling = true;

		try {
			const result = roll(expression);
			onRoll?.(result, characterName);
			expression = "";
		} catch (e) {
			error = e instanceof Error ? e.message : "Erro ao rolar";
		} finally {
			isRolling = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleRoll();
		}
	}
</script>

<div class="space-y-2">
	<div class="flex gap-2">
		<input
			type="text"
			bind:value={expression}
			onkeydown={handleKeydown}
			placeholder="2d6+3, 1d20, 4d6!"
			class="input input-bordered input-sm flex-1 bg-zinc-800 text-zinc-200 placeholder:text-zinc-600"
		/>
		<button
			onclick={handleRoll}
			disabled={isRolling}
			class="btn btn-primary btn-sm gap-1"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="2" y="2" width="20" height="20" rx="2" />
				<circle cx="8" cy="8" r="1" fill="currentColor" />
				<circle cx="16" cy="8" r="1" fill="currentColor" />
				<circle cx="8" cy="16" r="1" fill="currentColor" />
				<circle cx="16" cy="16" r="1" fill="currentColor" />
				<circle cx="12" cy="12" r="1" fill="currentColor" />
			</svg>
			Rolar
		</button>
	</div>

	{#if error}
		<p class="text-xs text-red-400">{error}</p>
	{/if}

	<details class="mt-2 text-xs text-zinc-500">
		<summary class="cursor-pointer hover:text-zinc-400">Ajuda de sintaxe</summary>
		<div class="mt-2 space-y-1 rounded bg-zinc-800/50 p-2">
			<p><code class="text-zinc-400">2d6</code> - 2 dados de 6 faces</p>
			<p><code class="text-zinc-400">1d20+5</code> - 1d20 + 5 de bônus</p>
			<p><code class="text-zinc-400">4d6!</code> - Explosão (rerola 6s)</p>
			<p><code class="text-zinc-400">2d6+1d8+3</code> - Múltiplos grupos</p>
		</div>
	</details>
</div>

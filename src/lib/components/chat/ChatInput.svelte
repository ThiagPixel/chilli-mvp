<script lang="ts">
	interface Props {
		onSend: (message: string) => void;
		disabled?: boolean;
	}

	let { onSend, disabled = false }: Props = $props();

	let message = $state("");

	function handleSubmit() {
		const trimmed = message.trim();
		if (!trimmed || disabled) return;

		onSend(trimmed);
		message = "";
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="flex gap-2">
	<textarea
		bind:value={message}
		onkeydown={handleKeydown}
		placeholder="Digite uma mensagem..."
		rows="1"
		{disabled}
		class="textarea textarea-bordered flex-1 resize-none bg-zinc-800 text-zinc-200 placeholder:text-zinc-600"
	></textarea>
	<button
		onclick={handleSubmit}
		{disabled}
		class="btn btn-primary"
		aria-label="Enviar mensagem"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="22" y1="2" x2="11" y2="13"></line>
			<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
		</svg>
	</button>
</div>

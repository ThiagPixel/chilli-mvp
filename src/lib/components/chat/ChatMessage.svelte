<script lang="ts">
	interface Props {
		content: string;
		senderName: string;
		isOwn?: boolean;
		createdAt: Date;
	}

	let { content, senderName, isOwn = false, createdAt }: Props = $props();

	function formatTime(date: Date): string {
		return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
	}
</script>

<div class="flex gap-2 {isOwn ? 'flex-row-reverse' : ''}">
	<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
		{senderName.charAt(0).toUpperCase()}
	</div>

	<div class="max-w-[80%] {isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5">
		<div class="flex items-center gap-2 {isOwn ? 'flex-row-reverse' : ''}">
			<span class="text-xs font-semibold text-zinc-400">{senderName}</span>
			<span class="text-xs text-zinc-600">{formatTime(createdAt)}</span>
		</div>
		<div class="rounded-2xl px-3 py-2 {isOwn ? 'bg-primary text-primary-content' : 'bg-zinc-700 text-zinc-200'}">
			<p class="whitespace-pre-wrap text-sm">{content}</p>
		</div>
	</div>
</div>

<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import ChatMessage from "./ChatMessage.svelte";
	import ChatInput from "./ChatInput.svelte";
	import type { RealtimeChannel } from "@supabase/supabase-js";
	import type { SupabaseClient } from "@supabase/supabase-js";

	interface MessageWithProfile {
		id: string;
		table_id: string;
		user_id: string;
		content: string;
		created_at: string;
		profiles?: {
			full_name: string | null;
			email: string;
		};
	}

	interface Props {
		tableId: string;
		currentUserId: string;
		supabase: SupabaseClient;
	}

	let { tableId, currentUserId, supabase }: Props = $props();

	let messages = $state<MessageWithProfile[]>([]);
	let channel: RealtimeChannel | null = $state(null);
	let messagesContainer: HTMLDivElement | null = $state(null);

	onMount(async () => {
		// Carregar mensagens iniciais
		const { data } = await supabase
			.from("table_messages")
			.select("*, profiles(*)")
			.eq("table_id", tableId)
			.order("created_at", { ascending: true })
			.limit(50);

		if (data) {
			messages = data as MessageWithProfile[];
		}

		// Inscrever no realtime
		channel = supabase
			.channel(`chat:${tableId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "table_messages",
					filter: `table_id=eq.${tableId}`,
				},
				async (payload) => {
					// Buscar dados do perfil
					const { data: profile } = await supabase
						.from("profiles")
						.select("full_name, email")
						.eq("id", (payload.new as { user_id: string }).user_id)
						.single();

					messages = [...messages, { ...(payload.new as MessageWithProfile), profiles: profile ?? undefined }];
					scrollToBottom();
				}
			)
			.subscribe();
	});

	onDestroy(() => {
		channel?.unsubscribe();
	});

	function scrollToBottom() {
		setTimeout(() => {
			messagesContainer?.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: "smooth",
			});
		}, 50);
	}

	async function handleSend(content: string) {
		await supabase.from("table_messages").insert({
			table_id: tableId,
			user_id: currentUserId,
			content,
		});
		// A mensagem aparecerá via realtime
	}
</script>

<div class="flex h-80 min-h-[320px] flex-col">
	<div class="flex items-center gap-2 border-b border-white/10 px-4 py-2">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
		</svg>
		<span class="text-sm font-semibold text-zinc-300">Chat</span>
	</div>

	<div bind:this={messagesContainer} class="flex-1 space-y-3 overflow-y-auto p-4">
		{#if messages.length === 0}
			<p class="py-8 text-center text-sm text-zinc-500">Nenhuma mensagem ainda</p>
		{:else}
			{#each messages as msg (msg.id)}
				<ChatMessage
					content={msg.content}
					senderName={msg.profiles?.full_name ?? msg.profiles?.email ?? "Usuário"}
					isOwn={msg.user_id === currentUserId}
					createdAt={new Date(msg.created_at)}
				/>
			{/each}
		{/if}
	</div>

	<div class="border-t border-white/10 p-3">
		<ChatInput onSend={handleSend} />
	</div>
</div>

<script lang="ts">
  import { enhance } from "$app/forms";
  import { ChatPanel } from "$lib/components/chat";
  import { DicePanel } from "$lib/components/dice";
  import { CharacterSheetModal, CharacterSheetCard } from "$lib/components/sheet";
  import { createBrowserClient } from "@supabase/ssr";
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
  import { onMount } from "svelte";

  interface TableData {
    id: string;
    name: string;
    description: string | null;
    master_id: string;
    invite_code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }

  interface MemberData {
    id: string;
    user_id: string;
    role: "master" | "player";
    display_name: string | null;
    joined_at: string;
  }

  interface SheetField {
    id: string;
    sheet_id: string;
    name: string;
    field_type: string;
    field_order: number;
    options: string[];
  }

  interface SheetValue {
    field_id: string;
    value: string | null;
  }

  interface SheetData {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
    fields: SheetField[];
    values: SheetValue[];
  }

  interface PageData {
    table: TableData;
    membership: MemberData;
    members: MemberData[];
    currentUserId: string;
  }

  interface Props {
    data: PageData;
    form?: { message?: string };
  }

  let { data, form }: Props = $props();

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  	let activeTab = $state<"chat" | "dice" | "sheets" | "turns" | "config">("chat");
  let copiedCode = $state(false);
  let tableName = $derived(data.table.name);
  let tableDescription = $derived(data.table.description || "");

  // Sheets state
  let sheets = $state<SheetData[]>([]);
  let isSheetModalOpen = $state(false);
  let isLoadingSheets = $state(false);

  const descriptionLimit = 500;

  onMount(() => {
    loadSheets();
  });

  async function loadSheets() {
    isLoadingSheets = true;

    // Carregar fichas do usuário
    const { data: userSheets } = await supabase
      .from("character_sheets")
      .select("*")
      .eq("table_id", data.table.id)
      .eq("user_id", data.currentUserId);

    if (userSheets) {
      // Para cada ficha, carregar campos e valores
      const sheetsWithData: SheetData[] = [];

      for (const sheet of userSheets) {
        const { data: fields } = await supabase
          .from("character_sheet_fields")
          .select("*")
          .eq("sheet_id", sheet.id)
          .order("field_order", { ascending: true });

        const { data: values } = await supabase
          .from("character_sheet_values")
          .select("field_id, value")
          .eq("sheet_id", sheet.id);

        sheetsWithData.push({
          ...sheet,
          fields: (fields || []).map((f: Record<string, unknown>) => ({
            ...f,
            options: (f.options as string[]) || [],
          })),
          values: values || [],
        });
      }

      sheets = sheetsWithData;
    }

    isLoadingSheets = false;
  }

  async function handleDeleteSheet(sheetId: string) {
    if (!confirm("Tem certeza que deseja deletar esta ficha?")) return;

    await supabase.from("character_sheets").delete().eq("id", sheetId);
    sheets = sheets.filter((s) => s.id !== sheetId);
  }

  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  async function copyInviteCode() {
    try {
      await navigator.clipboard.writeText(data.table.invite_code);

      copiedCode = true;

      window.setTimeout(() => {
        copiedCode = false;
      }, 1800);
    } catch (error) {
      console.error("Não foi possível copiar o código.", error);
    }
  }

  function confirmDelete(event: SubmitEvent) {
    const confirmed = window.confirm(
      `Tem certeza que deseja deletar a mesa "${data.table.name}"? Essa ação não poderá ser desfeita.`
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }
</script>

<svelte:head>
  <title>{data.table.name} | Chilli</title>
</svelte:head>

<main
  class="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#090909] px-4 py-8 text-zinc-100 sm:px-6 sm:py-10 lg:px-8"
>
  <!-- Fundo decorativo -->
  <div
    class="pointer-events-none absolute right-[-14rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-[#e50006]/10 blur-[120px]"
  ></div>

  <div
    class="pointer-events-none absolute bottom-[-16rem] left-[-14rem] h-[32rem] w-[32rem] rounded-full bg-[#e50006]/5 blur-[120px]"
  ></div>

  <div class="relative mx-auto max-w-7xl">
    <!-- Voltar -->
    <a
      href="/tables"
      class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:mb-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>

      Voltar para minhas mesas
    </a>

   <!-- Cabeçalho da mesa -->
<header
  class="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ed171e] via-[#b50006] to-[#4b0306] shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
>
  <div
    class="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"
  ></div>

  <div
    class="pointer-events-none absolute -bottom-28 right-24 h-64 w-64 rounded-full bg-black/10"
  ></div>

  <div
    class="relative flex flex-col items-center gap-7 px-5 py-8 text-center
      sm:px-8 sm:py-10
      lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:text-left"
  >
    <!-- Informações principais -->
    <div
      class="flex min-w-0 flex-col items-center
        lg:flex-row lg:items-center lg:gap-6"
    >
      <!-- Avatar -->
      <div
        class="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-white/20 bg-black/20 text-2xl font-black text-white shadow-xl backdrop-blur-sm"
      >
        {getInitials(data.table.name)}
      </div>

      <div class="mt-4 min-w-0 lg:mt-0">
        <!-- Campanha e cargo -->
        <div
          class="mb-3 flex flex-wrap items-center justify-center gap-2
            lg:justify-start"
        >
          <span
            class="text-xs font-bold uppercase tracking-[0.22em] text-white/60"
          >
            Campanha
          </span>

          <span
            class="badge border border-white/15 bg-black/20 px-3 py-3 text-xs font-bold text-white backdrop-blur-sm"
          >
            {data.membership.role === "master" ? "Mestre" : "Jogador"}
          </span>
        </div>

        <!-- Título -->
        <h1
          class="mx-auto max-w-2xl break-words text-center text-2xl font-black leading-tight tracking-tight text-white
            sm:text-3xl
            lg:mx-0 lg:text-left lg:text-4xl"
        >
          {data.table.name}
        </h1>

        <!-- Descrição -->
        <p
          class="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-white/70
            sm:text-base
            lg:mx-0 lg:text-left"
        >
          {data.table.description ||
            "Esta mesa ainda não possui uma descrição."}
        </p>
      </div>
    </div>

    <!-- Resumo -->
    <div
      class="grid w-full grid-cols-1 gap-3
        sm:max-w-lg sm:grid-cols-2
        lg:w-auto lg:max-w-none lg:shrink-0 lg:flex lg:items-stretch"
    >
      <div
        class="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-center backdrop-blur-sm
          lg:min-w-32 lg:text-left"
      >
        <p class="text-xs text-white/55">
          Participantes
        </p>

        <p class="mt-1 text-xl font-black text-white">
          {data.members.length}
        </p>
      </div>

      <div
        class="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-center backdrop-blur-sm
          lg:min-w-32 lg:text-left"
      >
        <p class="text-xs text-white/55">
          Seu cargo
        </p>

        <p class="mt-1 text-sm font-bold text-white sm:text-base">
          {data.membership.role === "master" ? "Mestre" : "Jogador"}
        </p>
      </div>
    </div>
  </div>
</header>

    	<!-- Tabs -->
        <div class="tabs tabs-boxed mb-6 bg-zinc-800/50 p-1">
          <button
            class="tab gap-2 {activeTab === 'chat' ? 'tab-active' : ''}"
            onclick={() => activeTab = "chat"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat
          </button>
          <button
            class="tab gap-2 {activeTab === 'dice' ? 'tab-active' : ''}"
            onclick={() => activeTab = "dice"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
              <circle cx="16" cy="8" r="1" fill="currentColor" />
              <circle cx="8" cy="16" r="1" fill="currentColor" />
              <circle cx="16" cy="16" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
            Dados
          </button>
          <button
            class="tab gap-2 {activeTab === 'sheets' ? 'tab-active' : ''}"
            onclick={() => activeTab = "sheets"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Fichas
          </button>
          <button
            class="tab gap-2 {activeTab === 'turns' ? 'tab-active' : ''}"
            onclick={() => activeTab = "turns"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Turnos
          </button>
          <button
            class="tab gap-2 {activeTab === 'config' ? 'tab-active' : ''}"
            onclick={() => activeTab = "config"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Config
          </button>
        </div>

    	<!-- Tab: Chat -->
        {#if activeTab === "chat"}
          <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
            <ChatPanel
              tableId={data.table.id}
              currentUserId={data.currentUserId}
              {supabase}
            />
          </article>
        {/if}

        <!-- Tab: Dados -->
        {#if activeTab === "dice"}
          <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
            <div class="border-b border-white/[0.07] px-5 py-3 sm:px-6">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ff454b]">
                  Dados
                </p>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <DicePanel
                tableId={data.table.id}
                currentUserId={data.currentUserId}
                characterName={data.membership.display_name || ""}
                {supabase}
              />
            </div>
          </article>
        {/if}

        <!-- Tab: Fichas -->
        {#if activeTab === "sheets"}
          <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
            <div class="border-b border-white/[0.07] px-5 py-3 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ff454b]">
                    Fichas
                  </p>
                </div>
                <button
                  onclick={() => isSheetModalOpen = true}
                  class="btn btn-primary btn-xs gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Nova Ficha
                </button>
              </div>
            </div>
            <div class="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {#if isLoadingSheets}
                <div class="flex justify-center py-8">
                  <span class="loading loading-spinner loading-sm text-primary"></span>
                </div>
              {:else if sheets.length === 0}
                <div class="flex flex-col items-center justify-center py-12 text-center">
                  <div class="mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/[0.04] text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <p class="text-zinc-500">Nenhuma ficha ainda</p>
                  <button
                    onclick={() => isSheetModalOpen = true}
                    class="btn btn-primary btn-sm mt-3"
                  >
                    Criar primeira ficha
                  </button>
                </div>
              {:else}
                <div class="grid gap-4 lg:grid-cols-2">
                  {#each sheets as sheet}
                    <CharacterSheetCard
                      {supabase}
                      {sheet}
                      isOwner={true}
                      onDelete={() => handleDeleteSheet(sheet.id)}
                      onUpdate={loadSheets}
                    />
                  {/each}
                </div>
              {/if}
            </div>
          </article>
        {/if}

        <!-- Tab: Turnos (Em breve) -->
        {#if activeTab === "turns"}
          <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
            <div class="flex flex-col items-center justify-center py-20 text-center">
              <div class="mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/[0.04] text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-zinc-200">Ordem de Turno</h3>
              <p class="mt-2 max-w-sm text-sm text-zinc-500">
                Em breve! Organize a ordem de turnos da sua mesa de RPG.
              </p>
            </div>
          </article>
        {/if}

        <!-- Tab: Configuração -->
    {#if activeTab === "config"}
      <section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
        <!-- Grupo -->
        <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
          <header class="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ff454b]">
                  Grupo
                </p>
              </div>
              <h2 class="mt-2 text-xl font-bold text-white">
                Participantes
              </h2>
              <p class="mt-1 text-sm text-zinc-500">
                Pessoas que fazem parte desta campanha.
              </p>
            </div>
            <span class="badge w-fit border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-semibold text-zinc-300">
              {data.members.length}
              {data.members.length === 1 ? "participante" : "participantes"}
            </span>
          </header>
          <div class="p-4 sm:p-6">
            {#if data.members.length === 0}
              <div class="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/15 px-5 text-center">
                <div class="mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/[0.04] text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 class="font-semibold text-zinc-200">
                  Nenhum participante encontrado
                </h3>
                <p class="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Os jogadores aparecerão aqui quando entrarem usando o código da mesa.
                </p>
              </div>
            {:else}
              <ul class="space-y-3">
                {#each data.members as member}
                  <li class="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-3 transition hover:border-white/10 hover:bg-white/[0.035] sm:gap-4 sm:p-4">
                    <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-sm font-black {member.role === 'master' ? 'bg-[#e50006]/15 text-[#ff454b]' : 'bg-white/[0.05] text-zinc-300'}">
                      {getInitials(member.display_name || member.user_id)}
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-semibold text-zinc-200 sm:text-base" title={member.display_name || member.user_id}>
                        {member.display_name || member.user_id}
                      </p>
                      <p class="mt-1 text-xs text-zinc-500">
                        {member.role === "master" ? "Administrador da campanha" : "Participante da campanha"}
                      </p>
                    </div>
                    <span class="badge shrink-0 border px-2 py-3 text-[11px] font-bold sm:px-3 sm:text-xs {member.role === 'master' ? 'border-[#e50006]/25 bg-[#e50006]/10 text-[#ff454b]' : 'border-white/10 bg-white/[0.04] text-zinc-400'}">
                      {member.role === "master" ? "Mestre" : "Jogador"}
                    </span>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </article>

        <!-- Administração (só master) -->
        {#if data.membership.role === "master"}
          <aside class="space-y-6">
            <!-- Código de convite -->
            <article class="overflow-hidden rounded-2xl border border-[#e50006]/20 bg-[#e50006]/10 shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
              <div class="border-b border-[#e50006]/20 px-5 py-4 sm:px-6">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ff454b]">
                    Convite
                  </p>
                </div>
              </div>
              <div class="p-5 sm:p-6">
                <p class="text-sm text-zinc-400">
                  Compartilhe este código com jogadores que deseja convidar:
                </p>
                <div class="mt-3 flex items-center gap-2">
                  <code class="flex-1 truncate rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-lg font-black tracking-[0.15em] text-white">
                    {data.table.invite_code}
                  </code>
                  <button
                    type="button"
                    onclick={copyInviteCode}
                    class="btn btn-square border-white/10 bg-white/[0.06] text-zinc-300 hover:border-[#e50006]/40 hover:bg-[#e50006] hover:text-white"
                    aria-label="Copiar código"
                  >
                    {#if copiedCode}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m20 6-11 11-5-5" />
                      </svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    {/if}
                  </button>
                </div>
              </div>
            </article>

            <!-- Editar mesa -->
            <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
              <header class="border-b border-white/[0.07] px-5 py-5 sm:px-6">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ff454b]">
                    Mesa
                  </p>
                </div>
                <h2 class="mt-2 text-xl font-bold text-white">
                  Editar mesa
                </h2>
                <p class="mt-1 text-sm leading-6 text-zinc-500">
                  Atualize as informações da sua campanha.
                </p>
              </header>
              <form method="POST" action="?/updateTable" use:enhance class="p-5 sm:p-6">
                <div class="form-control">
                  <label for="name" class="mb-2 block">
                    <span class="text-sm font-semibold text-zinc-200">Nome</span>
                    <span class="ml-1 text-[#ff454b]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={tableName}
                    maxlength="100"
                    required
                    class="input input-bordered w-full bg-zinc-800 text-zinc-200"
                  />
                  <div class="mt-2 flex justify-end">
                    <span class="text-xs text-zinc-600">{tableName.length}/100</span>
                  </div>
                </div>
                <div class="form-control mt-4">
                  <div class="mb-2 flex items-center justify-between gap-4">
                    <label for="description">
                      <span class="text-sm font-semibold text-zinc-200">Descrição</span>
                      <span class="ml-1 text-xs font-normal text-zinc-500">(opcional)</span>
                    </label>
                    <span class="text-xs text-zinc-600">{tableDescription.length}/500</span>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={tableDescription}
                    maxlength="500"
                    rows="3"
                    class="textarea textarea-bordered w-full bg-zinc-800 text-zinc-200 resize-none"
                  ></textarea>
                </div>
                <button type="submit" class="btn btn-primary mt-5 w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Salvar alterações
                </button>
              </form>
            </article>

            <!-- Deletar mesa -->
            <article class="overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/10 shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
              <div class="p-5 sm:p-6">
                <div class="flex items-start gap-4">
                  <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/15 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                      Zona perigosa
                    </p>
                    <h2 class="mt-2 text-lg font-bold text-white">
                      Deletar mesa
                    </h2>
                    <p class="mt-2 text-sm leading-6 text-zinc-500">
                      A mesa e seus dados serão removidos. Essa ação não poderá ser desfeita.
                    </p>
                  </div>
                </div>
                <form method="POST" action="?/deleteTable" onsubmit={confirmDelete} class="mt-5">
                  <button type="submit" class="btn w-full border border-red-500/30 bg-red-500/10 font-bold text-red-400 shadow-none hover:border-red-500 hover:bg-red-500 hover:text-white">
                    Deletar mesa permanentemente
                  </button>
                </form>
              </div>
            </article>
          </aside>
        {/if}
      </section>
    {/if}

    <!-- Modal de criar ficha -->
    <CharacterSheetModal
      {supabase}
      tableId={data.table.id}
      userId={data.currentUserId}
      isOpen={isSheetModalOpen}
      onClose={() => isSheetModalOpen = false}
      onSave={() => {
        isSheetModalOpen = false;
        loadSheets();
      }}
    />
  </div>
</main>

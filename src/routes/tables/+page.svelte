<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  let copiedCode: string | null = null;

  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  async function copyInviteCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      copiedCode = code;

      window.setTimeout(() => {
        if (copiedCode === code) {
          copiedCode = null;
        }
      }, 1800);
    } catch (error) {
      console.error("Não foi possível copiar o código da mesa.", error);
    }
  }
</script>

<svelte:head>
  <title>Minhas mesas | Chilli</title>
</svelte:head>

<main
  class="min-h-[calc(100vh-4rem)] bg-[#090909] px-4 py-8 text-zinc-100 sm:px-6 lg:px-8"
  style="background-image: radial-gradient(circle at top right, rgba(229, 0, 6, 0.12), transparent 32rem);"
>
  <div class="mx-auto max-w-7xl">
    <!-- Cabeçalho -->
    <header
      class="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <div class="mb-3 flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>

          <span
            class="text-xs font-bold uppercase tracking-[0.22em] text-[#ff4449]"
          >
            Campanhas
          </span>
        </div>

        <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Minhas mesas
        </h1>

        <p class="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
          Acesse suas campanhas, gerencie jogadores e continue suas aventuras.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <a
          href="/tables/join"
          class="btn h-12 min-h-12 border border-white/10 bg-white/[0.04] px-5 text-zinc-200 shadow-none hover:border-white/20 hover:bg-white/[0.08]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" x2="3" y1="12" y2="12" />
          </svg>

          Entrar em uma mesa
        </a>

        <a
          href="/tables/create"
          class="btn h-12 min-h-12 border-0 bg-[#e50006] px-5 text-white shadow-[0_10px_30px_rgba(229,0,6,0.2)] hover:bg-[#ff1118]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>

          Criar nova mesa
        </a>
      </div>
    </header>

    <!-- Mensagem retornada pelo servidor -->
    {#if data.message}
      <div
        role="alert"
        class="alert mb-8 border border-[#e50006]/20 bg-[#e50006]/10 text-zinc-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff4449"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>

        <span>{data.message}</span>
      </div>
    {/if}

    {#if data.tables.length === 0}
      <!-- Estado vazio -->
      <section
        class="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#141414]/80 px-6 text-center"
      >
        <div
          class="mb-6 grid h-24 w-24 place-items-center rounded-full border border-[#e50006]/20 bg-[#e50006]/10 text-[#ff252c]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="43"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 16V8" />
            <path d="m3 7 9-4 9 4-9 4Z" />
            <path d="m3 7 9 4 9-4" />
            <path d="M3 7v9l9 5 9-5" />
            <path d="M12 11v10" />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-white">
          Nenhuma mesa encontrada
        </h2>

        <p class="mt-3 max-w-md leading-6 text-zinc-400">
          Crie sua primeira campanha como mestre ou utilize um código de convite
          para participar de uma mesa.
        </p>

        <div class="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href="/tables/create"
            class="btn border-0 bg-[#e50006] text-white hover:bg-[#ff1118]"
          >
            Criar minha primeira mesa
          </a>

          <a
            href="/tables/join"
            class="btn border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08]"
          >
            Usar código de convite
          </a>
        </div>
      </section>
    {:else}
      <!-- Contagem -->
      <div class="mb-5 flex items-center gap-2 text-sm text-zinc-400">
        <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>

        <span>
          Você participa de
          <strong class="text-zinc-200">
            {data.tables.length}
            {data.tables.length === 1 ? "mesa" : "mesas"}
          </strong>
        </span>
      </div>

      <!-- Cards -->
      <section
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {#each data.tables as membership}
          <article
            class="card group overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#e50006]/45 hover:shadow-[0_24px_70px_rgba(229,0,6,0.13)]"
          >
            <!-- Capa do card -->
            <div
              class="relative h-28 overflow-hidden {membership.role === 'master'
                ? 'bg-gradient-to-br from-[#ff2229] via-[#cf0007] to-[#69070b]'
                : 'bg-gradient-to-br from-[#44444b] via-[#29292e] to-[#111113]'}"
            >
              <div
                class="absolute -left-8 -top-14 h-36 w-36 rounded-full border border-white/10"
              ></div>

              <div
                class="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-black/15"
              ></div>

              <div
                class="absolute left-5 top-4 flex items-center gap-2 text-xs font-semibold text-white/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 2 8.5 5v10L12 22l-8.5-5V7Z" />
                  <path d="m12 2 4 7-4 13-4-13Z" />
                  <path d="m3.5 7 4.5 2h8l4.5-2" />
                </svg>

                CHILLI RPG
              </div>

              <span
                class="badge absolute right-4 top-4 border border-white/15 bg-black/25 px-3 py-3 text-xs font-bold text-white backdrop-blur-sm"
              >
                {membership.role === "master" ? "Mestre" : "Jogador"}
              </span>
            </div>

            <!-- Avatar da mesa -->
            <div class="relative -mt-11 flex justify-center">
              <div
                class="relative grid h-20 w-20 place-items-center rounded-full border-[5px] border-[#151515] bg-zinc-100 text-xl font-black text-zinc-950 shadow-xl"
              >
                {getInitials(membership.table.name)}

                <span
                  class="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-[#151515] bg-[#e50006] text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12 2 8.5 5v10L12 22l-8.5-5V7Z" />
                    <path d="m12 2 4 7-4 13-4-13Z" />
                  </svg>
                </span>
              </div>
            </div>

            <div class="card-body min-h-[330px] items-center px-5 pb-5 pt-4 text-center">
              <h2
                class="max-w-full truncate text-xl font-bold tracking-tight text-white"
                title={membership.table.name}
              >
                {membership.table.name}
              </h2>

              <p class="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                Campanha de RPG
              </p>

              <p
                class="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-zinc-400"
              >
                {membership.table.description ||
                  "Esta mesa ainda não possui uma descrição."}
              </p>

              <!-- Informações da participação -->
              <div
                class="mt-4 flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.035] px-4 py-3 text-left"
              >
                <div>
                  <p class="text-xs text-zinc-500">Sua função</p>

                  <p class="mt-1 text-sm font-semibold text-zinc-200">
                    {membership.role === "master"
                      ? "Mestre da mesa"
                      : "Jogador da mesa"}
                  </p>
                </div>

                <div
                  class="grid h-9 w-9 place-items-center rounded-lg {membership.role ===
                  'master'
                    ? 'bg-[#e50006]/15 text-[#ff3036]'
                    : 'bg-white/[0.06] text-zinc-300'}"
                >
                  {#if membership.role === "master"}
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
                      <path d="m2 4 3 12h14l3-12-6 5-4-7-4 7Z" />
                      <path d="M5 20h14" />
                    </svg>
                  {:else}
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  {/if}
                </div>
              </div>

              <!-- Área com altura semelhante para todos os cards -->
              <div class="mt-3 min-h-[70px] w-full">
                {#if membership.role === "master"}
                  <div
                    class="rounded-xl border border-white/[0.06] bg-black/25 p-3 text-left"
                  >
                    <p class="mb-2 text-xs text-zinc-500">
                      Código de convite
                    </p>

                    <div class="flex items-center justify-between gap-3">
                      <code
                        class="truncate font-mono text-sm font-bold tracking-wider text-zinc-200"
                      >
                        {membership.table.invite_code}
                      </code>

                      <button
                        type="button"
                        class="btn btn-square btn-sm border-white/10 bg-white/[0.05] text-zinc-300 hover:border-[#e50006]/30 hover:bg-[#e50006]/10 hover:text-[#ff3036]"
                        aria-label="Copiar código da mesa"
                        title="Copiar código"
                        on:click={() =>
                          copyInviteCode(membership.table.invite_code)}
                      >
                        {#if copiedCode === membership.table.invite_code}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m20 6-11 11-5-5" />
                          </svg>
                        {:else}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <rect
                              width="14"
                              height="14"
                              x="8"
                              y="8"
                              rx="2"
                              ry="2"
                            />
                            <path
                              d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                            />
                          </svg>
                        {/if}
                      </button>
                    </div>
                  </div>
                {:else}
                  <div
                    class="flex min-h-[70px] items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-4 text-left"
                  >
                    <span
                      class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-zinc-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </span>

                    <p class="text-xs leading-5 text-zinc-500">
                      O código de convite é administrado pelo mestre.
                    </p>
                  </div>
                {/if}
              </div>

              <div class="card-actions mt-auto w-full pt-3">
                <a
                  href={"/tables/" + membership.table.id}
                  class="btn w-full border border-white/10 bg-white/[0.05] text-white shadow-none transition-colors group-hover:border-[#e50006]/30 group-hover:bg-[#e50006] hover:!border-[#ff1b22] hover:!bg-[#ff1b22]"
                >
                  Abrir mesa

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        {/each}
      </section>
    {/if}
  </div>
</main>
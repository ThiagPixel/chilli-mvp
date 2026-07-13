<script lang="ts">
  export let form;

  let tableName = "";
  let description = "";

  const descriptionLimit = 500;
</script>

<svelte:head>
  <title>Criar mesa | Chilli</title>
</svelte:head>

<main
  class="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#090909] px-4 py-10 text-zinc-100 sm:px-6"
>
  <!-- Fundo decorativo -->
  <div
    class="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-[#e50006]/10 blur-[110px]"
  ></div>

  <div
    class="pointer-events-none absolute bottom-[-14rem] left-[-14rem] h-[30rem] w-[30rem] rounded-full bg-[#e50006]/5 blur-[110px]"
  ></div>

  <div class="relative mx-auto max-w-4xl">
    <!-- Voltar -->
    <a
      href="/tables"
      class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
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

    <section
      class="overflow-hidden rounded-3xl border border-white/10 bg-[#141414] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
    >
      <!-- Cabeçalho vermelho -->
      <header
        class="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#ed171e] via-[#b60006] to-[#510306] px-6 py-9 sm:px-10"
      >
        <div
          class="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10"
        ></div>

        <div
          class="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-black/10"
        ></div>

        <div class="relative flex items-start gap-5">
          <div
            class="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/20 bg-black/15 text-white backdrop-blur-sm sm:grid"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="31"
              height="31"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
              <path d="m17.5 3.5 3 3" />
              <path d="M20.5 3.5l-3 3" />
              <path d="m3.5 17.5 3 3" />
              <path d="m6.5 17.5-3 3" />
            </svg>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-white/65">
              Nova campanha
            </p>

            <h1 class="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Criar uma mesa
            </h1>

            <p class="mt-3 max-w-2xl leading-6 text-white/70">
              Dê um nome à sua campanha. Depois da criação, você receberá um
              código para convidar seus jogadores.
            </p>
          </div>
        </div>
      </header>

      <!-- Formulário -->
      <div class="px-6 py-10 sm:px-10 lg:px-14">
        {#if form?.message}
          <div
            role="alert"
            class="alert mb-7 rounded-xl border border-[#e50006]/25 bg-[#e50006]/10 text-zinc-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff454b"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>

            <span>{form.message}</span>
          </div>
        {/if}

        <form method="POST" class="space-y-7">
          <div class="form-control">
            <label for="name" class="mb-2 block">
              <span class="text-sm font-semibold text-zinc-200">
                Nome da mesa
              </span>

              <span class="ml-1 text-[#ff3d43]">*</span>
            </label>

            <div class="relative">
              <span
                class="pointer-events-none absolute inset-y-0 left-0 grid w-12 place-items-center text-zinc-500"
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
                  <path d="m12 2 8.5 5v10L12 22l-8.5-5V7Z" />
                  <path d="m12 2 4 7-4 13-4-13Z" />
                  <path d="m3.5 7 4.5 2h8l4.5-2" />
                </svg>
              </span>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: A Maldição de Ravenloft"
                required
                maxlength="100"
                autocomplete="off"
                bind:value={tableName}
                class="input h-14 w-full border-white/10 bg-black/25 pl-12 text-white outline-none placeholder:text-zinc-600 focus:border-[#e50006] focus:outline-none"
              />
            </div>

            <div class="mt-2 flex items-center justify-between gap-4">
              <p class="text-xs leading-5 text-zinc-500">
                Este será o nome exibido na sua lista de campanhas.
              </p>

              <span class="shrink-0 text-xs text-zinc-600">
                {tableName.length}/100
              </span>
            </div>
          </div>

          <div class="form-control">
            <div class="mb-2 flex items-center justify-between gap-4">
              <label for="description">
                <span class="text-sm font-semibold text-zinc-200">
                  Descrição
                </span>

                <span class="ml-1 text-xs font-normal text-zinc-500">
                  opcional
                </span>
              </label>

              <span class="text-xs text-zinc-600">
                {description.length}/{descriptionLimit}
              </span>
            </div>

            <textarea
              id="description"
              name="description"
              placeholder="Conte brevemente sobre o cenário, sistema ou proposta da campanha..."
              maxlength={descriptionLimit}
              bind:value={description}
              class="textarea min-h-36 w-full resize-y border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none placeholder:text-zinc-600 focus:border-[#e50006] focus:outline-none"
            ></textarea>

            <p class="mt-2 text-xs leading-5 text-zinc-500">
              Uma boa descrição ajuda os jogadores a identificarem a campanha.
            </p>
          </div>

          <!-- Prévia -->
          <div
            class="rounded-2xl border border-white/[0.07] bg-black/20 p-5 sm:p-6"
          >
            <div class="mb-5 flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Prévia
                </p>

                <p class="mt-1 text-sm text-zinc-400">
                  Como a campanha aparecerá na lista.
                </p>
              </div>

              <span
                class="badge border border-[#e50006]/25 bg-[#e50006]/10 px-3 py-3 text-xs font-semibold text-[#ff454b]"
              >
                Mestre
              </span>
            </div>

            <div
              class="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-[#181818] p-4 sm:flex-row sm:items-center"
            >
              <div
                class="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#f01820] to-[#790006] text-lg font-black text-white shadow-[0_10px_25px_rgba(229,0,6,0.18)]"
              >
                {tableName.trim().charAt(0).toUpperCase() || "C"}
              </div>

              <div class="min-w-0">
                <h2 class="truncate font-bold text-white">
                  {tableName.trim() || "Nome da sua campanha"}
                </h2>

                <p class="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">
                  {description.trim() ||
                    "A descrição da campanha aparecerá neste espaço."}
                </p>
              </div>
            </div>
          </div>

          <div
            class="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-7 sm:flex-row sm:justify-end"
          >
            <a
              href="/tables"
              class="btn h-13 min-h-13 border-white/10 bg-white/[0.04] px-6 text-zinc-300 shadow-none hover:border-white/20 hover:bg-white/[0.08]"
            >
              Cancelar
            </a>

            <button
              type="submit"
              class="btn h-13 min-h-13 border-0 bg-[#e50006] px-7 font-bold text-white shadow-[0_14px_35px_rgba(229,0,6,0.22)] hover:bg-[#ff1118]"
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

              Criar mesa
            </button>
          </div>
        </form>
      </div>
    </section>

    <div
      class="mx-auto mt-6 flex max-w-2xl items-start justify-center gap-3 text-center text-xs leading-5 text-zinc-600"
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
        class="mt-0.5 shrink-0"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>

      Você será definido automaticamente como mestre e administrador da nova
      campanha.
    </div>
  </div>
</main>
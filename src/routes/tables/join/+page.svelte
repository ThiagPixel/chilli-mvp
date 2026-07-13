<script lang="ts">
  export let form;

  let inviteCode = "";

  function formatInviteCode(event: Event) {
    const input = event.currentTarget as HTMLInputElement;

    inviteCode = input.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);
  }
</script>

<svelte:head>
  <title>Entrar em uma mesa | Chilli</title>
</svelte:head>

<main
  class="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#090909] px-4 py-10 text-zinc-100 sm:px-6"
>
  <!-- Elementos decorativos de fundo -->
  <div
    class="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#e50006]/10 blur-[100px]"
  ></div>

  <div
    class="pointer-events-none absolute bottom-[-14rem] left-[-12rem] h-[28rem] w-[28rem] rounded-full bg-[#e50006]/5 blur-[100px]"
  ></div>

  <div class="relative mx-auto max-w-5xl">
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
      class="grid overflow-hidden rounded-3xl border border-white/10 bg-[#141414] shadow-[0_30px_100px_rgba(0,0,0,0.55)] lg:grid-cols-[0.85fr_1.15fr]"
    >
      <!-- Painel lateral -->
      <div
        class="relative hidden min-h-[580px] overflow-hidden bg-gradient-to-br from-[#f01820] via-[#bc0006] to-[#4b0306] p-10 lg:flex lg:flex-col lg:justify-between"
      >
        <div
          class="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10"
        ></div>

        <div
          class="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/10"
        ></div>

        <div
          class="absolute bottom-20 right-[-4rem] h-48 w-48 rotate-12 rounded-3xl bg-black/10"
        ></div>

        <div class="relative">
          <div
            class="mb-8 grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-black/15 text-white backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
          </div>

          <p class="text-xs font-bold uppercase tracking-[0.25em] text-white/65">
            Chilli RPG
          </p>

          <h2 class="mt-4 max-w-xs text-4xl font-black leading-tight text-white">
            Sua próxima aventura começa aqui.
          </h2>

          <p class="mt-5 max-w-sm leading-7 text-white/70">
            Utilize o código enviado pelo mestre para participar da campanha e
            acessar sua mesa.
          </p>
        </div>

        <div class="relative space-y-4 text-sm text-white/75">
          <div class="flex items-center gap-3">
            <span
              class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/15"
            >
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
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>

            Entre usando apenas o código da mesa.
          </div>

          <div class="flex items-center gap-3">
            <span
              class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/15"
            >
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
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>

            Escolha como será chamado na campanha.
          </div>
        </div>
      </div>

      <!-- Formulário -->
      <div class="px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div class="mb-9">
          <div class="mb-4 flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-[#e50006]"></span>

            <span
              class="text-xs font-bold uppercase tracking-[0.22em] text-[#ff3d43]"
            >
              Convite
            </span>
          </div>

          <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Entrar em uma mesa
          </h1>

          <p class="mt-3 leading-6 text-zinc-400">
            Informe o código de convite compartilhado pelo mestre.
          </p>
        </div>

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

        <form method="POST" class="space-y-6">
          <div class="form-control">
            <label for="invite_code" class="mb-2 block">
              <span class="text-sm font-semibold text-zinc-200">
                Código da mesa
              </span>
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
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 8h.01" />
                  <path d="M16 8h.01" />
                  <path d="M8 16h.01" />
                  <path d="M16 16h.01" />
                  <path d="M12 12h.01" />
                </svg>
              </span>

              <input
                id="invite_code"
                name="invite_code"
                type="text"
                placeholder="Ex: A7F92B10"
                required
                maxlength="8"
                autocomplete="off"
                spellcheck="false"
                bind:value={inviteCode}
                on:input={formatInviteCode}
                class="input h-14 w-full border-white/10 bg-black/25 pl-12 font-mono text-base font-bold uppercase tracking-[0.18em] text-white outline-none placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 focus:border-[#e50006] focus:outline-none"
              />
            </div>

            <p class="mt-2 text-xs leading-5 text-zinc-500">
              O código possui letras e números e pode ser encontrado no convite
              enviado pelo mestre.
            </p>
          </div>

          <div class="form-control">
            <label for="display_name" class="mb-2 block">
              <span class="text-sm font-semibold text-zinc-200">
                Seu nome nessa mesa
              </span>

              <span class="ml-1 text-xs font-normal text-zinc-500">
                opcional
              </span>
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>

              <input
                id="display_name"
                name="display_name"
                type="text"
                placeholder="Ex: Samuel"
                autocomplete="nickname"
                class="input h-14 w-full border-white/10 bg-black/25 pl-12 text-white outline-none placeholder:text-zinc-600 focus:border-[#e50006] focus:outline-none"
              />
            </div>

            <p class="mt-2 text-xs leading-5 text-zinc-500">
              Este nome será exibido para o mestre e os outros jogadores.
            </p>
          </div>

          <button
            type="submit"
            class="btn h-14 min-h-14 w-full border-0 bg-[#e50006] text-base font-bold text-white shadow-[0_14px_35px_rgba(229,0,6,0.22)] hover:bg-[#ff1118]"
          >
            Entrar na mesa

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
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </form>

        <div
          class="mt-8 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
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
            class="mt-0.5 shrink-0 text-zinc-500"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>

          <p class="text-xs leading-5 text-zinc-500">
            Não possui um código? Solicite ao mestre da campanha ou crie sua
            própria mesa.
          </p>
        </div>
      </div>
    </section>
  </div>
</main>
<script lang="ts">
	let { data } = $props();
</script>

<div class="hero mt-8 min-h-[60vh] rounded-2xl bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold text-primary">
				Bem-vindo ao Chilli 🌶️
			</h1>

			<p class="py-6 text-lg">
				Uma plataforma moderna construída com SvelteKit, Supabase e DaisyUI.
			</p>

			{#if data.user}
				<div class="flex flex-col items-center gap-5">
					<p class="text-xl">
						Olá,
						<span class="font-bold text-primary">
							{data.user.email}
						</span>!
					</p>

					<div class="flex w-full flex-col justify-center gap-3 sm:flex-row">
						<a href="/tables" class="btn btn-primary btn-lg">
							Minhas mesas
						</a>

						<a href="/profile" class="btn btn-outline btn-primary btn-lg">
							Ver perfil
						</a>
					</div>
				</div>
			{:else}
				<div class="flex flex-col justify-center gap-3 sm:flex-row">
					<a href="/login" class="btn btn-primary">
						Entrar
					</a>

					<a href="/register" class="btn btn-outline btn-primary">
						Criar conta
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
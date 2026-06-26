<script lang="ts">
	let { data } = $props();
</script>

<div class="hero min-h-[60vh] bg-base-200 rounded-2xl mt-8">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold text-primary">Bem-vindo ao Chilli 🌶️</h1>
			<p class="py-6 text-lg">
				Uma plataforma moderna construída com SvelteKit, Supabase e DaisyUI.
			</p>
			{#if data.user}
				<div class="flex flex-col gap-4 items-center">
					<p class="text-xl">Olá, <span class="text-primary font-bold">{data.user.email}</span>!</p>
					<a href="/profile" class="btn btn-primary btn-lg">Ver Perfil</a>
				</div>
			{:else}
				<div class="flex gap-4 justify-center">
					<a href="/login" class="btn btn-primary">Entrar</a>
					<a href="/register" class="btn btn-outline btn-primary">Criar Conta</a>
				</div>
			{/if}
		</div>
	</div>
</div>

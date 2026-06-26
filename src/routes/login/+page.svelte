<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
	let loading = $state(false);

	const urlError = $derived($page.url.searchParams.get('error'));
</script>

<div class="flex justify-center items-center min-h-[60vh]">
	<div class="card w-full max-w-md bg-base-200 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl font-bold text-primary justify-center mb-4">Entrar</h2>

			{#if form?.error}
				<div class="alert alert-error mb-4">
					<span>{form.error}</span>
				</div>
			{/if}

			{#if urlError}
				<div class="alert alert-error mb-4">
					<span>Falha na autenticação. Tente novamente.</span>
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<fieldset class="flex flex-col gap-4">
					<div class="form-control">
						<label for="email" class="label">
							<span class="label-text">Email</span>
						</label>
						<input
							type="email"
							name="email"
							id="email"
							value={form?.email ?? ''}
							placeholder="seu@email.com"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<div class="form-control">
						<label for="password" class="label">
							<span class="label-text">Senha</span>
						</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<button type="submit" class="btn btn-primary w-full" disabled={loading}>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
				</fieldset>
			</form>

			<div class="divider">ou</div>

			<p class="text-center">
				Não tem conta?
				<a href="/register" class="link link-primary">Criar conta</a>
			</p>
		</div>
	</div>
</div>

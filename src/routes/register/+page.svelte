<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
	let loading = $state(false);
</script>

<div class="flex justify-center items-center min-h-[60vh]">
	<div class="card w-full max-w-md bg-base-200 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl font-bold text-primary justify-center mb-4">Criar Conta</h2>

			{#if form?.error}
				<div class="alert alert-error mb-4">
					<span>{form.error}</span>
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
						<label for="full_name" class="label">
							<span class="label-text">Nome Completo</span>
						</label>
						<input
							type="text"
							name="full_name"
							id="full_name"
							value={form?.full_name ?? ''}
							placeholder="João Silva"
							class="input input-bordered w-full"
							required
						/>
					</div>

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
							placeholder="Mínimo 6 caracteres"
							class="input input-bordered w-full"
							minlength="6"
							required
						/>
					</div>

					<button type="submit" class="btn btn-primary w-full" disabled={loading}>
						{loading ? 'Criando conta...' : 'Criar Conta'}
					</button>
				</fieldset>
			</form>

			<div class="divider">ou</div>

			<p class="text-center">
				Já tem conta?
				<a href="/login" class="link link-primary">Entrar</a>
			</p>
		</div>
	</div>
</div>

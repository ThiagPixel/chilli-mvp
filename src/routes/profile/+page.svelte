<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	let loadingProfile = $state(false);
	let loadingPassword = $state(false);
</script>

<div class="max-w-2xl mx-auto">
	<div class="card bg-base-200 shadow-xl">
		<div class="card-body">
			<h1 class="card-title text-3xl font-bold text-primary mb-6">Meu Perfil</h1>

			{#if form?.success}
				<div class="alert alert-success mb-4">
					<span>Perfil atualizado com sucesso!</span>
				</div>
			{/if}

			{#if form?.error}
				<div class="alert alert-error mb-4">
					<span>{form.error}</span>
				</div>
			{/if}

			<!-- Avatar e Info -->
			<div class="flex flex-col items-center mb-8">
				<div class="w-32 h-32 rounded-full bg-primary text-primary-content flex items-center justify-center text-5xl font-bold mb-4">
					{data.profile?.full_name?.charAt(0).toUpperCase() || data.user?.email?.charAt(0).toUpperCase() || 'U'}
				</div>
				<h2 class="text-2xl font-bold">{data.profile?.full_name || 'Usuário'}</h2>
				<p class="text-base-content/60">{data.user?.email}</p>
				<p class="text-sm text-base-content/40">
					Membro desde {new Date(data.profile?.created_at || Date.now()).toLocaleDateString('pt-BR')}
				</p>
			</div>

			<!-- Formulário de Perfil -->
			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					loadingProfile = true;
					return async ({ update }) => {
						await update();
						loadingProfile = false;
					};
				}}
			>
				<fieldset class="flex flex-col gap-4 mb-8">
					<legend class="text-lg font-semibold mb-2">Informações Pessoais</legend>

					<div class="form-control">
						<label for="full_name" class="label">
							<span class="label-text">Nome Completo</span>
						</label>
						<input
							type="text"
							name="full_name"
							id="full_name"
							value={form?.full_name ?? data.profile?.full_name ?? ''}
							placeholder="Seu nome"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<div class="form-control">
						<label for="bio" class="label">
							<span class="label-text">Bio</span>
						</label>
						<textarea
							name="bio"
							id="bio"
							placeholder="Conte um pouco sobre você..."
							class="textarea textarea-bordered w-full h-24"
							value={form?.bio ?? data.profile?.bio ?? ''}
						></textarea>
					</div>

					<button type="submit" class="btn btn-primary" disabled={loadingProfile}>
						{loadingProfile ? 'Salvando...' : 'Salvar Alterações'}
					</button>
				</fieldset>
			</form>

			<div class="divider"></div>

			<!-- Formulário de Senha -->
			<form
				method="POST"
				action="?/updatePassword"
				use:enhance={() => {
					loadingPassword = true;
					return async ({ update }) => {
						await update();
						loadingPassword = false;
					};
				}}
			>
				<fieldset class="flex flex-col gap-4">
					<legend class="text-lg font-semibold mb-2">Alterar Senha</legend>

					{#if form?.passwordSuccess}
						<div class="alert alert-success">
							<span>Senha alterada com sucesso!</span>
						</div>
					{/if}

					{#if form?.passwordError}
						<div class="alert alert-error">
							<span>{form.passwordError}</span>
						</div>
					{/if}

					<div class="form-control">
						<label for="current_password" class="label">
							<span class="label-text">Senha Atual</span>
						</label>
						<input
							type="password"
							name="current_password"
							id="current_password"
							placeholder="••••••••"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<div class="form-control">
						<label for="new_password" class="label">
							<span class="label-text">Nova Senha</span>
						</label>
						<input
							type="password"
							name="new_password"
							id="new_password"
							placeholder="••••••••"
							class="input input-bordered w-full"
							minlength="6"
							required
						/>
					</div>

					<div class="form-control">
						<label for="confirm_password" class="label">
							<span class="label-text">Confirmar Nova Senha</span>
						</label>
						<input
							type="password"
							name="confirm_password"
							id="confirm_password"
							placeholder="••••••••"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<button type="submit" class="btn btn-secondary" disabled={loadingPassword}>
						{loadingPassword ? 'Alterando...' : 'Alterar Senha'}
					</button>
				</fieldset>
			</form>
		</div>
	</div>
</div>

<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { invalidate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { createBrowserClient } from '@supabase/ssr';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

	let { data, children } = $props();

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	async function handleLogout() {
		try {
			const response = await fetch('/auth/logout', { method: 'POST' });
			if (response.ok || response.status === 303) {
				// Clear client-side auth state
				await invalidate('supabase:auth');
				// Redirect to login
				await goto('/login');
			} else {
				console.error('Logout failed:', response.statusText);
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	onMount(() => {
		// Listen for auth state changes on the client (e.g., user signs out in another tab)
		// This invalidates the server-side session so safeGetSession() will re-validate.
		// Note: The actual user object is never trusted from onAuthStateChange();
		// it's always re-validated server-side via getUser() in safeGetSession()
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => subscription.unsubscribe();
	});
</script>

<div class="min-h-screen bg-base-100 text-base-content">
	<nav class="navbar bg-base-200 shadow-md">
		<div class="container mx-auto">
			<div class="flex-1">
				<a href="/" class="btn btn-ghost text-xl font-bold text-primary">🌶️ Chilli</a>
			</div>
			<div class="flex-none">
				{#if data.user}
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
							<div class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
								{data.user.email?.charAt(0).toUpperCase() || 'U'}
							</div>
						</div>
						<ul class="menu dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52">
							<li><a href="/profile" class="btn btn-ghost justify-start">Perfil</a></li>
							<li>
								<button type="button" onclick={handleLogout} class="w-full text-left">Sair</button>
							</li>
						</ul>
					</div>
				{:else}
					<a href="/login" class="btn btn-primary">Entrar</a>
				{/if}
			</div>
		</div>
	</nav>

	<main class="container mx-auto p-4">
		{@render children()}
	</main>
</div>

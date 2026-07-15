<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";

	interface Field {
		name: string;
		field_type: "text" | "number" | "textarea" | "select";
		options?: string[];
	}

	interface Props {
		supabase: SupabaseClient;
		tableId: string;
		userId: string;
		isOpen: boolean;
		onClose: () => void;
		onSave: () => void;
	}

	let { supabase, tableId, userId, isOpen, onClose, onSave }: Props = $props();

	let sheetName = $state("");
	let fields = $state<Field[]>([
		{ name: "", field_type: "text" }
	]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	function addField() {
		fields = [...fields, { name: "", field_type: "text" }];
	}

	function removeField(index: number) {
		fields = fields.filter((_, i) => i !== index);
	}

	function updateField(index: number, updates: Partial<Field>) {
		fields = fields.map((f, i) => (i === index ? { ...f, ...updates } : f));
	}

	function handleOptionsChange(index: number, value: string) {
		const options = value.split(",").map((o) => o.trim()).filter(Boolean);
		updateField(index, { options });
	}

	async function handleSubmit() {
		error = null;

		if (!sheetName.trim()) {
			error = "Nome da ficha é obrigatório";
			return;
		}

		const validFields = fields.filter((f) => f.name.trim());
		if (validFields.length === 0) {
			error = "Adicione pelo menos um campo";
			return;
		}

		isLoading = true;

		try {
			// Criar a ficha
			const { data: sheet, error: sheetError } = await supabase
				.from("character_sheets")
				.insert({
					table_id: tableId,
					user_id: userId,
					name: sheetName.trim(),
				})
				.select()
				.single();

			if (sheetError) throw sheetError;

			// Criar os campos
			const fieldsToInsert = validFields.map((f, index) => ({
				sheet_id: sheet.id,
				name: f.name.trim(),
				field_type: f.field_type,
				field_order: index,
				options: f.options || [],
			}));

			const { error: fieldsError } = await supabase
				.from("character_sheet_fields")
				.insert(fieldsToInsert);

			if (fieldsError) throw fieldsError;

			// Fechar e notificar
			resetForm();
			onSave();
		} catch (e) {
			console.error("[SheetModal] Error:", e);
			error = "Erro ao criar ficha";
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		sheetName = "";
		fields = [{ name: "", field_type: "text" }];
		error = null;
	}

	function handleClose() {
		resetForm();
		onClose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="w-full max-w-lg rounded-2xl border border-white/10 bg-[#141414] shadow-xl">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-white/10 p-5">
				<h2 id="modal-title" class="text-xl font-bold text-white">Nova Ficha</h2>
				<button
					onclick={handleClose}
					class="btn btn-circle btn-ghost btn-sm text-zinc-400 hover:text-white"
					aria-label="Fechar"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Body -->
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="p-5 space-y-4">
				{#if error}
					<div class="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
						{error}
					</div>
				{/if}

				<!-- Nome da Ficha -->
				<div class="form-control">
					<label for="sheet-name" class="label">
						<span class="label-text text-zinc-300">Nome da Ficha</span>
					</label>
					<input
						id="sheet-name"
						type="text"
						bind:value={sheetName}
						placeholder="Ex: Ficha de Personagem"
						class="input input-bordered w-full bg-zinc-800 text-zinc-200"
					/>
				</div>

				<!-- Campos -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="label-text text-zinc-300">Campos</span>
						<button type="button" onclick={addField} class="btn btn-primary btn-xs gap-1">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 5v14M5 12h14" />
							</svg>
							Adicionar Campo
						</button>
					</div>

					{#each fields as field, index}
						<div class="flex gap-2 items-start">
							<div class="flex-1 space-y-1">
								<input
									type="text"
									value={field.name}
									oninput={(e) => updateField(index, { name: e.currentTarget.value })}
									placeholder="Nome do campo"
									class="input input-bordered input-sm w-full bg-zinc-800 text-zinc-200"
								/>
								<div class="flex gap-2">
									<select
										value={field.field_type}
										onchange={(e) => updateField(index, { field_type: e.currentTarget.value as Field["field_type"] })}
										class="select select-bordered select-sm w-full bg-zinc-800 text-zinc-200"
									>
										<option value="text">Texto</option>
										<option value="number">Número</option>
										<option value="textarea">Área de Texto</option>
										<option value="select">Seleção</option>
									</select>
									{#if field.field_type === "select"}
										<input
											type="text"
											value={field.options?.join(", ") || ""}
											oninput={(e) => handleOptionsChange(index, e.currentTarget.value)}
											placeholder="opção1, opção2"
											class="input input-bordered input-sm w-full bg-zinc-800 text-zinc-200"
										/>
									{/if}
								</div>
							</div>
							{#if fields.length > 1}
								<button
										type="button"
										onclick={() => removeField(index)}
										class="btn btn-circle btn-ghost btn-sm text-zinc-500 hover:text-red-400"
										aria-label="Remover campo"
									>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M18 6L6 18M6 6l12 12" />
									</svg>
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<!-- Actions -->
				<div class="flex gap-2 pt-2">
					<button type="button" onclick={handleClose} class="btn flex-1">
						Cancelar
					</button>
					<button type="submit" class="btn btn-primary flex-1" disabled={isLoading}>
						{#if isLoading}
							<span class="loading loading-spinner loading-sm"></span>
						{:else}
							Criar Ficha
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

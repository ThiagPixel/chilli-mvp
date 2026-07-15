<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";

	interface Field {
		id: string;
		name: string;
		field_type: string;
		field_order: number;
		options: string[];
	}

	interface SheetData {
		id: string;
		name: string;
		user_id: string;
		created_at: string;
		fields: Field[];
		values: Array<{ field_id: string; value: string | null }>;
	}

	interface Props {
		supabase: SupabaseClient;
		sheet: SheetData;
		isOwner: boolean;
		onDelete: () => void;
		onUpdate: () => void;
	}

	let { supabase, sheet, isOwner, onDelete, onUpdate }: Props = $props();

	let fields = $derived(sheet.fields);
	let valuesMap = $derived(
		sheet.values.reduce((acc, v) => {
			acc[v.field_id] = v.value || "";
			return acc;
		}, {} as Record<string, string>)
	);
	let editedValues = $state<Record<string, string>>({});
	let isEditing = $state(false);
	let isSaving = $state(false);

	$effect(() => {
		editedValues = { ...valuesMap };
	});

	async function saveValues() {
		isSaving = true;

		try {
			for (const field of fields) {
				const value = editedValues[field.id] || "";

				const { error } = await supabase
					.from("character_sheet_values")
					.upsert({
						sheet_id: sheet.id,
						field_id: field.id,
						value,
						updated_at: new Date().toISOString(),
					}, {
						onConflict: "sheet_id,field_id",
					});

				if (error) throw error;
			}

			isEditing = false;
			onUpdate();
		} catch (e) {
			console.error("[SheetCard] Error saving:", e);
		} finally {
			isSaving = false;
		}
	}

	function handleInputChange(fieldId: string, value: string) {
		editedValues[fieldId] = value;
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	}
</script>

<div class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-[#e50006]"></span>
			<h3 class="font-semibold text-white">{sheet.name}</h3>
		</div>
		<div class="flex items-center gap-1">
			{#if isOwner && !isEditing}
				<button
					onclick={() => isEditing = true}
					class="btn btn-ghost btn-xs text-zinc-400 hover:text-white"
					aria-label="Editar ficha"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
					</svg>
				</button>
				<button
					onclick={onDelete}
					class="btn btn-ghost btn-xs text-zinc-400 hover:text-red-400"
					aria-label="Excluir ficha"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Fields -->
	<div class="p-4 space-y-3">
		{#each [...fields].sort((a, b) => a.field_order - b.field_order) as field}
			<div class="space-y-1">
				<label for="field-{field.id}" class="text-xs font-medium text-zinc-400">{field.name}</label>

				{#if field.field_type === "text"}
					<input
						id="field-{field.id}"
						type="text"
						value={isEditing ? editedValues[field.id] : valuesMap[field.id]}
						oninput={(e) => handleInputChange(field.id, e.currentTarget.value)}
						disabled={!isOwner}
						class="input input-bordered input-sm w-full bg-zinc-800 text-zinc-200 disabled:opacity-60"
					/>
				{:else if field.field_type === "number"}
					<input
						id="field-{field.id}"
						type="number"
						value={isEditing ? editedValues[field.id] : valuesMap[field.id]}
						oninput={(e) => handleInputChange(field.id, e.currentTarget.value)}
						disabled={!isOwner}
						class="input input-bordered input-sm w-full bg-zinc-800 text-zinc-200 disabled:opacity-60"
					/>
				{:else if field.field_type === "textarea"}
					<textarea
						id="field-{field.id}"
						value={isEditing ? editedValues[field.id] : valuesMap[field.id]}
						oninput={(e) => handleInputChange(field.id, e.currentTarget.value)}
						disabled={!isOwner}
						rows="3"
						class="textarea textarea-bordered textarea-sm w-full bg-zinc-800 text-zinc-200 disabled:opacity-60 resize-none"
					></textarea>
				{:else if field.field_type === "select"}
					<select
						id="field-{field.id}"
						value={isEditing ? editedValues[field.id] : valuesMap[field.id]}
						onchange={(e) => handleInputChange(field.id, e.currentTarget.value)}
						disabled={!isOwner}
						class="select select-bordered select-sm w-full bg-zinc-800 text-zinc-200 disabled:opacity-60"
					>
						<option value="">Selecione...</option>
						{#each (field.options || []) as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Footer -->
	<div class="flex items-center justify-between border-t border-white/10 px-4 py-2">
		<span class="text-xs text-zinc-500">
			Criada em {formatDate(sheet.created_at)}
		</span>
		{#if isEditing}
			<div class="flex gap-2">
				<button onclick={() => isEditing = false} class="btn btn-ghost btn-xs">
					Cancelar
				</button>
				<button onclick={saveValues} class="btn btn-primary btn-xs" disabled={isSaving}>
					{#if isSaving}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						Salvar
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>

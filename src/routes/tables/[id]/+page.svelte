<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  export let data: PageData;
  export let form: ActionData;
</script>

<h1>{data.table.name}</h1>

{#if data.table.description}
  <p>{data.table.description}</p>
{/if}

<p>
  Seu cargo:
  <strong>
    {data.membership.role === "master" ? "Mestre" : "Player"}
  </strong>
</p>

{#if data.membership.role === "master"}
  <p>
    Código para convidar players:
    <strong>{data.table.invite_code}</strong>
  </p>
{/if}

{#if form?.message}
  <p>{form.message}</p>
{/if}

<h2>Participantes</h2>

{#if data.members.length === 0}
  <p>Nenhum participante encontrado.</p>
{:else}
  <ul>
    {#each data.members as member}
      <li>
        <strong>{member.display_name || member.user_id}</strong>
        —
        {member.role === "master" ? "Mestre" : "Player"}
      </li>
    {/each}
  </ul>
{/if}

{#if data.membership.role === "master"}
  <hr />

  <h2>Editar mesa</h2>

  <form method="POST" action="?/updateTable">
    <label>
      Nome da mesa
      <input name="name" value={data.table.name} required />
    </label>

    <label>
      Descrição
      <textarea name="description">{data.table.description || ""}</textarea>
    </label>

    <button type="submit">Salvar alterações</button>
  </form>

  <hr />

  <h2>Zona perigosa</h2>

  <form method="POST" action="?/deleteTable">
    <button type="submit">Deletar mesa</button>
  </form>
{/if}

<a href="/tables">Voltar para minhas mesas</a>
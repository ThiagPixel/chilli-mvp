<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1>Minhas mesas</h1>

<a href="/tables/create">Criar mesa</a>
<a href="/tables/join">Entrar em mesa</a>

{#if data.message}
  <p>{data.message}</p>
{/if}

{#if data.tables.length === 0}
  <p>Você ainda não participa de nenhuma mesa.</p>
{:else}
  <div>
    {#each data.tables as membership}
      <article>
        <h2>{membership.table.name}</h2>

        {#if membership.table.description}
          <p>{membership.table.description}</p>
        {/if}

        <p>
          Cargo:
          <strong>
            {membership.role === "master" ? "Mestre" : "Player"}
          </strong>
        </p>

        {#if membership.role === "master"}
          <p>
            Código da mesa:
            <strong>{membership.table.invite_code}</strong>
          </p>
        {/if}

        <a href={"/tables/" + membership.table.id}>
          Abrir mesa
        </a>
      </article>
    {/each}
  </div>
{/if}
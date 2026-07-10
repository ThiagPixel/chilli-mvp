<script lang="ts">
  export let form;
</script>

<h1>Entrar em uma mesa</h1>

<form method="POST">
  <label>
    Código da mesa
    <input name="invite_code" placeholder="Ex: A7F92B10" required />
  </label>

  <label>
    Seu nome nessa mesa
    <input name="display_name" placeholder="Ex: Samuel" />
  </label>

  <button type="submit">Entrar</button>

  {#if form?.message}
    <p>{form.message}</p>
  {/if}
</form>

<a href="/tables">Voltar</a>
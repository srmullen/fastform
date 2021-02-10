<script lang="ts">
  import { getContext } from 'svelte';
  import { FORM } from './contexts';
  // This needs to get the enclosing context

  let classNames = '';
  export { classNames as class };

  const { form } = getContext(FORM);
</script>

<form on:submit|preventDefault={form.handleSubmit} class="{classNames}">
  <slot></slot>
</form>
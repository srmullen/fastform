<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import { FORM } from './contexts';
  import type { Touched, Errors } from './types';

  export let name: string;

  const { form } = getContext(FORM);

  let touched = false;
  let error: string;

  let touchedUnsub: any;
  let errorsUnsub: any;

  // onMount(() => {
    touchedUnsub = form.touched.subscribe((t: Touched) => {
      touched = t && t[name];
    });

    errorsUnsub = form.errors.subscribe((errors: Errors) => {
      error = errors && errors[name];
    });
  // });

  onDestroy(() => {
    touchedUnsub();
    errorsUnsub();
  });
</script>

{#if touched && error}
  <slot {error} />
{/if}
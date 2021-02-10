<script lang="ts">
  import { getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import type { Writable } from 'svelte/store';
  import { FORM } from './contexts';

  export let id: string | undefined = undefined;
  export let name: string;
  export let type = 'text';
  export let value: any = undefined;
  export let placeholder: string | undefined = undefined;
  let classNames = '';
  export { classNames as class };

  const { form } = getContext(FORM);

  let bind: any;
  let binding: Writable<any>;
  if (type === 'select') {
    const val = form.getValue(name);
    bind = val;
    binding = writable(val);
    $: {
      binding.set(bind);
    }
  }
</script>

{#if type === 'checkbox' || type === 'radio'}
  <input 
    {id}
    class={classNames}
    {type}
    {...$$restProps}
    use:form.getFieldProps={{ name, type, value }}
  />
{:else if type === 'select'}
  <select 
    {id}
    class={classNames}
    bind:value={bind}
    on:change={() => binding.set(bind)}
    use:form.getFieldProps={{ name, type, binding }}
    {...$$restProps}
  >
    <slot />
  </select>
{:else}
  <input 
    {id}
    class={classNames}
    {type}
    {placeholder}
    {...$$restProps}
    use:form.getFieldProps={name}
  />
{/if}
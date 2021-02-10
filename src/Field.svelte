<script lang="ts">
  import { getContext } from 'svelte';
  import { FORM } from './contexts';

  export let name: string;
  export let type = 'text';
  export let value: any = undefined;
  let classNames = '';
  export { classNames as class };

  const { form } = getContext(FORM);
</script>

{#if type === 'checkbox' || type === 'radio'}
  <input 
    class={classNames}
    {type}
    {...$$restProps}
    use:form.getFieldProps={{ name, type, value }}
  />
{:else if type === 'select'}
  <select 
    class={classNames}
    use:form.getFieldProps={{ name, type }}
    {...$$restProps}
  >
    <slot />
  </select>
{:else}
  <input 
    class={classNames}
    {type}
    {...$$restProps}
    use:form.getFieldProps={name}
  />
{/if}
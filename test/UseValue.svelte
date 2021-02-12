<svelte:options accessors />

<script lang="ts">
  import { FastForm } from '../src';
  import type { FormState } from '../src/types';

  // For testing purposes only.
  export let form: FormState | undefined = undefined;

  export let initialValues: { [key: string]: any } | undefined = undefined;
  export let options: any[] = [];
  export let name: string;
  export let type: 'select' | 'radio' | 'checkbox';
</script>

<FastForm
  {initialValues}
  let:form
  bind:form
>
  {#if type === 'select'}
    <select 
      data-testid={name}
      use:form.props={name}
    >
      {#each options as option, i}
        <option use:form.value={option}>Option {i}</option>
      {/each}
    </select>
  {:else if type === 'radio'}
    {#each options as option, i}
      <!-- <input 
        data-testid="radio{i}"
        type="radio"
        use:form.props={name}
        use:form.value={option}
      /> -->
      
      <!-- OR -->

      <input 
        data-testid="radio{i}"
        type="radio"
        use:form.props={{ name, value: option }}
      />
    {/each}
  {:else if type === 'checkbox'}
    {#each options as option, i}
      <!-- <input 
        data-testid="checkbox{i}"
        type="checkbox"
        use:form.props={name}
        use:form.value={option}
      /> -->

      <!-- OR -->

      <input 
        data-testid="checkbox{i}"
        type="checkbox"
        use:form.props={{ name, value: option }}
      />
    {/each}
  {/if}
</FastForm>
<!-- With useField -->

<svelte:options accessors />

<script lang="ts">
  import { FastForm } from '../src';
  import type { FormState, ValidateFn, Values, Errors  } from '../src/types';
  import BasicInputsUseField from './BasicInputsUseField.svelte';

  export let initialValues = { userName: '', password: '', email: '', awesome: [], food: '' };
  export let validate: ValidateFn;
  export let onSubmit = submit;

  export let form: FormState | undefined = undefined;

  function submit(values: Values, errors: Errors) {
    if (errors && Object.keys(errors).length) {
      console.log('Failed validation');
      return;
    }
    alert(JSON.stringify(values, null, 2));
  }
</script>

<FastForm
  {initialValues}
  {validate}
  onSubmit={onSubmit}
  bind:form
  let:form
  let:values
  let:touched
  let:errors
>
  <div class="flex">
    <form class="m-4 flex-grow" on:submit|preventDefault={form.handleSubmit}>
      <BasicInputsUseField {form} />
    </form>
    <div class="m-8 flex-grow">
      <h3>Values</h3>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <h3>Touched</h3>
      <pre>{JSON.stringify(touched, null, 2)}</pre>
      <h3>Errors</h3>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
    </div>
  </div>
</FastForm>

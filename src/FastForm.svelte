<script lang="ts">
  import { setContext } from 'svelte';
  import { useForm } from './core';
  import type { Values, ValidateFn, SubmitFn } from './types';
  import { FORM } from './contexts';

  export let initialValues: Values | undefined = undefined;
  export let validate: ValidateFn | undefined = undefined;
  export let onSubmit: SubmitFn | undefined = undefined;

  export const form = useForm({
    initialValues,
    validate,
    onSubmit
  });

  setContext(FORM, { form });

  const { 
    values: valuesStore, 
    errors: errorsStore, 
    touched: touchedStore, 
    submitting: submittingStore 
  } = form;
  $: values = $valuesStore;
  $: errors = $errorsStore;
  $: touched = $touchedStore;
  $: submitting = $submittingStore;
</script>

<slot 
  {form} 
  values={values}
  touched={touched}
  errors={errors}
  {submitting}
/>

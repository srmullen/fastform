<!-- 
  This form does not use any svelte components. It only uses the function provided by the form folder. 
-->

<svelte:options accessors />

<script lang="ts">
  import type { Errors, Values } from '../../src/types';
  import { useForm } from '../../src';
  import * as Yup from 'Yup';
  import { getIn, setIn } from '../../src/utils';

  export let initialValues = { 
    userName: '', 
    email: '', 
    password: '',
    awesome: [], 
    food: ''
  };

  const schema = Yup.object({
    userName: Yup.string().max(15, 'Max length is 15 characters').required('Required'),
    password: Yup.string().min(6, 'Min length is 6 characters').required('Required'),
    email: Yup.string().email('Invalid email').required('Required')
  });

  // export let validate = schemaValidate;
  export let validate = manualValidate;
  export let onSubmit = (values: Values, errors: Errors) => {
    if (errors && Object.keys(errors).length) {
      console.log('Failed validation');
      return;
    }
    alert(JSON.stringify(values, null, 2));
  }

  export const form = useForm({
    initialValues,
    // validate: manualValidate,
    // validate: schemaValidate,
    validate,
    onSubmit
  });

  const values = form.values;
  const errors = form.errors;
  const touched = form.touched;

  function manualValidate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.userName) {
    errors.userName = 'Required';
  } else if (values.userName.length > 15) {
    errors.userName = 'Must be less than 15 characters';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length <= 6) {
    errors.password = 'Must be more than 6 characters';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.jobType) {
    errors.jobType = 'Required';
  } else if (values.jobType === 'lazyBum') {
    errors.jobType = 'No lazy bums allowed';
  }

  if (!values.awesome || !values.awesome.length) {
    errors.awesome = 'Required';
  }

  if (values.food === 'ice cream') {
    errors.food = 'frozen cow juice';
  }

  return errors;
}

  function yupToFormErrors(yupError: any) {
    let errors: Errors = {};
    if (yupError.inner) {
      if (yupError.inner.length === 0) {
        return setIn(errors, yupError.path, yupError.message);
      }
      for (let err of yupError.inner) {
        if (!getIn(errors, err.path)) {
          errors = setIn(errors, err.path, err.message)
        }
      }
    }
    return errors;
  }

  async function schemaValidate(values: Values): Promise<Errors> {
    const errors: Errors = {};

    try {
      await schema.validate(values, { abortEarly: false, context: values });
    } catch (err) {
      // console.log(yupToFormErrors(err));
      return yupToFormErrors(err);
    }

    return errors;
  }
</script>

<form data-testid="form" class="m-4" on:submit|preventDefault={form.handleSubmit}>
  <div>
    <label for="userName">Username</label>
    <input 
      class="border-gray-900 border"
      id="userName"
      data-testid="userName"
      type="text" 
      use:form.props={'userName'}
    />
    <div data-testid="userNameErrors">
      {#if $touched.userName && $errors.userName}
        {$errors.userName}
      {/if}
    </div>
  </div>
  <div>
    <label for="email">Email Address</label>
    <input 
      class="border border-gray-900"
      id="email"
      data-testid="email"
      type="email" 
      use:form.props={'email'}
    />
    <div data-testid="emailErrors">
      {#if $touched.email && $errors.email}
        {$errors.email}
      {/if}
    </div>
  </div>
  <div>
    <label for="password">Password</label>
    <input 
      class="border border-gray-900"
      id="password"
      data-testid="password"
      type="password" 
      use:form.props={'password'}
    />
    <div data-testid="passwordErrors">
      {#if $touched.password && $errors.password}
        {$errors.password}
      {/if}
    </div>
  </div>
  <div>
    <label for="jobType">Job Type</label>
    <select 
      id="jobType" 
      class="border border-gray-900"
      data-testid="jobType"
      use:form.props={'jobType'}
    >
      <option value="">Choose</option>
      <option value="Designer">Designer</option>
      <option value="Developer">Developer</option>
      <option value="Product">Product</option>
      <option value="lazyBum" data-testid="lazyBum">Lazy Bum</option>
    </select>
    <div data-testid="jobTypeErrors">
      {#if $touched.jobType && $errors.jobType}
        {$errors.jobType}
      {/if}
    </div>
  </div>
  <div>
    <label class="block">
      <input 
        data-testid="awesomeCheckbox"
        type="checkbox" 
        name="awesome"
        value="awesome!"
        on:input={form.handleCheckbox}
        on:blur={form.handleBlur}
      />
      <span>This is awesome!</span>
    </label>
    <label class="block">
      <input 
        data-testid="coolCheckbox"
        type="checkbox" 
        name="awesome"
        value="cool"
        on:input={form.handleCheckbox}
        on:blur={form.handleBlur}
      />
      <span>And it's cool!</span>
    </label>
    {#if $touched.awesome && $errors.awesome}
      <div>{$errors.awesome}</div>
    {/if}
  </div>
  <div>
    <label class="block">
      <input 
        data-testid="pizza"
        type="radio" 
        name="food"
        value="pizza"
        on:input={form.handleRadio}
        on:blur={form.handleBlur}
      />
      <span>Pizza</span>
    </label>
    <label class="block">
      <input 
        data-testid="iceCream"
        type="radio" 
        name="food"
        value="ice cream"
        on:input={form.handleRadio}
        on:blur={form.handleBlur}
      />
      <span>Ice Cream</span>
    </label>
    {#if $touched.food && $errors.food}
      <div>{$errors.food}</div>
    {/if}
  </div>
  <div>
    <label>Number Input</label>
    <input
      type="number"
      class="border border-gray-900"
      use:form.props={"mynumber"}
    />
  </div>
  <div>
    <label for="startDate">Start Date</label>
    <input 
      type="date" 
      id="startDate"
      use:form.props={'startDate'}
    />
  </div>
  <div>
    <label for="myrange">Range</label>
    <input
      type="range"
      min="10"
      max="40"
      use:form.props={'myrange'}
    />
  </div>
  <button 
    data-testid="submit-btn"
    class="bg-green-900 text-white py-2 px-4" type="submit"
  >
    Submit
  </button>
  <pre>{JSON.stringify($values, null, 2)}</pre>
  <pre>{JSON.stringify($errors, null, 2)}</pre>
  <pre>{JSON.stringify($touched, null, 2)}</pre>
</form>
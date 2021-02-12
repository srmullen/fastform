<!-- Using form package provided components -->

<svelte:options accessors />

<script lang="ts">
  import { FastForm } from '../src';
  import type { FormState, ValidateFn, Values, Errors  } from '../src/types';

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
  <form class="m-4" on:submit|preventDefault={form.handleSubmit}>
    <div>
      <label for="userName">First Name</label>
      <input 
        class="border-gray-900 border"
        id="userName" 
        data-testid="userName"
        type="text" 
        use:form.props={'userName'}
      />
      {#if touched.userName && errors.userName}
        <div>{errors.userName}</div>
      {/if}
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
      {#if touched.email && errors.email}
        <div>{errors.email}</div>
      {/if}
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
      {#if touched.password && errors.password}
        <div>{errors.password}</div>
      {/if}
    </div>
    <div>
      <select 
        id="jobType" 
        class="border border-gray-900"
        data-testid="jobType"
        use:form.props={'jobType'}
      >
        <!-- <option value="">Choose</option>
        <option value="Designer">Designer</option>
        <option value="Developer">Developer</option>
        <option value="Product">Product</option>
        <option value="lazyBum">Lazy Bum</option> -->
        <option use:form.value={null}>Choose</option>
        <option use:form.value={"Designer"}>Designer</option>
        <option use:form.value={"Developer"}>Developer</option>
        <option use:form.value={"Product"}>Product</option>
        <option use:form.value={"lazyBum"} data-testid="lazyBum">Lazy Bum</option>
      </select>
      <div data-testid="jobTypeErrors">
        {#if touched.jobType && errors.jobType}
          {errors.jobType}
        {/if}
      </div>
    </div>
    <div>
      <label class="block">
        <input 
          data-testid="awesomeCheckbox"
          type="checkbox" 
          name="awesome"
          use:form.value={"awesome!"}
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
          use:form.value={"cool"}
          on:input={form.handleCheckbox}
          on:blur={form.handleBlur}
        />
        <span>And it's cool!</span>
      </label>
      {#if touched.awesome && errors.awesome}
        <div>{errors.awesome}</div>
      {/if}
    </div>
    <div>
      <label class="block">
        <input 
          data-testid="pizza"
          type="radio" 
          name="food"
          use:form.value={"pizza"}
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
          use:form.value={"ice cream"}
          on:input={form.handleRadio}
          on:blur={form.handleBlur}
        />
        <span>Ice Cream</span>
      </label>
      {#if touched.food && errors.food}
        <div>{errors.food}</div>
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
    <button data-testid="submit-btn" class="bg-green-900 text-white py-2 px-4" type="submit">Submit</button>
  </form>
  <pre>{JSON.stringify(values, null, 2)}</pre>
  <pre>{JSON.stringify(touched, null, 2)}</pre>
  <pre>{JSON.stringify(errors, null, 2)}</pre>
</FastForm>

<svelte:options accessors />

<script lang="ts">
  import { FastForm, Form, Field, ErrorMessage } from '../src';
  import type { ValidateFn, FormState, Values, Errors } from '../src/types';

  const jobTypes = [
    { value: 'designer', title: "Designer" },
    { value: 'developer', title: "Developer" },
    { value: 'product', title: "Product" },
    { value: 'lazyBum', title: "Lazy Bum" }
  ];
  const awesomeCheckboxes = [{ text: 'this is awesome' }, { text: 'super cool' }];


  export let initialValues = { 
    userName: '', 
    password: '', 
    email: '', 
    awesome: [], 
    food: '', 
    // jobType: jobTypes[2] 
    // jobType: jobTypes[3].value
  };
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
  {onSubmit}
  bind:form
  let:form
  let:values
  let:touched
  let:errors
>
  <Form class="p-4">
    <div class="m-2">
      <label for="userName">Username</label>
      <Field 
        id="userName"
        class="border-gray-900 border"
        name="userName" 
        type="text" 
        placeholder="Username"
        data-testid="userName"
      />
      <ErrorMessage name="userName" let:error>
        <div>{error}</div>
      </ErrorMessage>
    </div>
    <div class="m-2">
      <label for="email">Email Address</label>
      <Field 
        class="border border-gray-900"
        id="email"
        name="email"
        type="email" 
        data-testid="email"
      />
      <ErrorMessage name="email" let:error>
        <div>{error}</div>
      </ErrorMessage>
    </div>
    <div class="m-2">
      <label for="password">Password</label>
      <Field 
        id="password"
        class="border-gray-900 border"
        name="password"
        data-testid="password"
        type="password"
      />
      <ErrorMessage name="password" let:error>
        <div>{error}</div>
      </ErrorMessage>
    </div>
    <div>
      <label for="jobType">Job Type</label>
      <Field 
        id="jobType" 
        class="border border-gray-900"
        name="jobType"
        type="select"
        data-testid="jobType"
      >
        <!-- <option use:form.value={null}>Choose</option>
        {#each jobTypes as jobType}          
          <option 
            data-testid={jobType.value}
            use:form.value={jobType}
          >
            {jobType.title}
          </option>
        {/each} -->

        <option value="">Choose</option>
        {#each jobTypes as jobType}
          <option 
            data-testid="{jobType.value}"
            value="{jobType.value}"
          >
            {jobType.title}
          </option>
        {/each}

      </Field>
      <ErrorMessage name="jobType" let:error>
        <div>{error}</div>
      </ErrorMessage>
    </div>
    <!-- <div>
      <label class="block">
        <Field 
          name="awesome"
          type="checkbox"
          value={awesomeCheckboxes[0]}
          data-testid="awesomeCheckbox"
        />
        <span>This is awesome!</span>
      </label>
      <label class="block">
        <Field 
          name="awesome"
          type="checkbox"
          value={awesomeCheckboxes[1]}
          data-testid="coolCheckbox"
        />
        <span>And it's cool!</span>
      </label>
      <ErrorMessage name="awesome" let:error>
        <div>{error}</div>
      </ErrorMessage>
    </div> -->
    <div>
      <label class="block">
        <Field 
          name="awesome"
          type="checkbox"
          value="awesome!"
          data-testid="awesomeCheckbox"
        />
        <span>This is awesome!</span>
      </label>
      <label class="block">
        <Field 
          name="awesome"
          type="checkbox"
          value="cool"
          data-testid="coolCheckbox"
        />
        <span>And it's cool!</span>
      </label>
      <ErrorMessage name="awesome" let:error>
        <div>{error}</div>
      </ErrorMessage>
    </div>
    <div>
      <label class="block">
        <Field 
          type="radio"
          name="food"
          value="pizza"
          data-testid="pizza"
        />
        <span>Pizza</span>
      </label>
      <label class="block">
        <Field 
          type="radio"
          name="food"
          value="ice cream"
          data-testid="iceCream"
        />
        <span>Ice Cream</span>
      </label>
      <ErrorMessage name="food" let:error>
        <div>{error}</div>
      </ErrorMessage>
    </div>
    <div>
      <label for="mynumber">Number Input</label>
      <Field 
        id="mynumber"
        type="number"
        name="mynumber"
        class="border border-gray-900"
      />
    </div>
    <div>
      <label for="startDate">Start Date</label>
      <Field 
        type="date" 
        id="startDate"
        name="startDate"
      />
    </div>
    <div>
      <label for="myrange">Range</label>
      <Field
        id="myrange"
        type="range"
        name="myrange"
        min="10"
        max="40"
      />
    </div>
    <button data-testid="submit-btn" class="bg-green-900 text-white py-2 px-4" type="submit">Submit</button>
  </Form>
  <pre>{JSON.stringify(values, null, 2)}</pre>
  <pre>{JSON.stringify(touched, null, 2)}</pre>
  <pre>{JSON.stringify(errors, null, 2)}</pre>
</FastForm>
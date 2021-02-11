FastForm
========

FastForm is a library that simplifies building complex forms in Svelte. It is largely based on the [Formik library](https://github.com/formium/formik) for React. It's goal is to centralize form logic, helping you create forms your users will love filling out! It is comprised of Components and Api hooks that you can use in whatever combination you prefer.

Examples
--------

```js
// submissionform.js
export function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = "Email required";
  }

  if (!values.password) {
    errors.password = "Password required";
  }

  return errors;
}

export function onSubmit(values, errors) {
  if (!Object.keys(errors).length) {
    console.log(`Form submitted: ${values}`)
  }
}
```

```html
<!-- UsingComponents.svelte -->
<script>
  import { FastForm, Form, Field } from 'fastform';
  import { validate, onSubmit } from 'submissionform';
</script>

<FastForm {validate} {onSubmit}>
  <Form>
    <label for="email">Email</label>
    <Field id="email" name="email" type="email" />
    <label for="password">Password</label>
    <Field id="password" name="password" type="password" />
    <label>
      <Field name="notRobot" type="checkbox" />
      <span>I am not a robot</span>
    </label>
    <button type="submit">Submit</button>
  </Form>
</FastForm>
```

```html
<!-- UsingHooks.svelte -->
<script>
  import { useForm } from 'fastform';
  import { validate, onSubmit } from 'submissionform';

  const form = useForm({
    validate,
    onSubmit
  });
</script>

<form on:submit|preventDefault={form.handleSubmit}>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" use:form.props={'email'} />
  <label for="password">Password</label>
  <input id="password" type="password" use:form.props={'password'} />
  <label>
    <input name="notRobot" type="checkbox" use:form.props={'notRobot'} />
    <span>I am not a robot</span>
  </label>
  <button type="submit">Submit</button>
</form>
```

Installation
------------

`npm install --save-dev fastform`

Components
----------

### FastForm

FastForm is a component that provides the instance to all child components. It does this through Svelte's context api.

#### Props

- initialValues: An object containing the initial state of your form.
- validate: A function to validate your form.
- onSubmit: A function to handle submitting your form.

### Form

Form is a simple component that handles wiring your form's submit handler

### Field

Field is a component that handles configuring inputs for your form.

#### Props

- name: [Required]
- type: [default: 'text]
- value: A value that will be associated with the input. Useful for checkbox and radio input types.

Api
---

### useForm

### useField
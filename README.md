FastForm
========

FastForm is a library that simplifies building complex forms in Svelte. It is largely based on the [Formik library](https://github.com/formium/formik) for React. It's goal is to centralize form logic, helping you create forms your users will love filling out! It is comprised of Components and Api hooks that you can use in whatever combination you prefer.

[See it in action](https://codesandbox.io/s/useform-login-0jge7?file=/App.svelte)

[Contact form example](https://codesandbox.io/s/usefield-contact-cq7bc?file=/ContactForm.svelte)

Benefits
-----

- Allows any data type to be associated with an input.
- Ability to create your own input types.
- Allow nested paths.

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

  const { handleSubmit, props } = useForm({
    validate,
    onSubmit
  });
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" use:props={'email'} />
  <label for="password">Password</label>
  <input id="password" type="password" use:props={'password'} />
  <label>
    <input name="notRobot" type="checkbox" use:props={'notRobot'} />
    <span>I am not a robot</span>
  </label>
  <button type="submit">Submit</button>
</form>
```

Installation
------------

`npm install --save-dev fastform`

Api
---

### useForm

Creates an object that tracks the state of the form. It has stores for tracking `values`, `errors`, `touched` and `submitting` state. It has a `props` action that attached all required listeners to an input. The `value` action attached arbitrary data to an element (ex. a radio button can have an object as a value rather than just a string).

### useField

`useField` creates a field on a form. It returns an object that has `value`, `error` and `touched` stores. These stores refer to just the specific field. Calling `set` or `update` on them will also change the state of the form stores. The field object also returns `props` and `value` actions that work the same as the form object.

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
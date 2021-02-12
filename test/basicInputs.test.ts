import { wait } from './testingUtils';
import { get } from 'svelte/store';
import type { Values, Errors } from '../src/types';
import { render, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import BasicInputsV1 from './components/BasicInputsV1.svelte';
import BasicInputsV2 from './components/BasicInputsV2.svelte';
import BasicInputsV3 from './components/BasicInputsV3.svelte';
import BasicInputsV4 from './components/BasicInputsV4.svelte';

testForm(BasicInputsV1, 'V1');
testForm(BasicInputsV2, 'V2');
testForm(BasicInputsV3, 'V3');
testForm(BasicInputsV4, 'V4');

function validate(values: Values): Errors {
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

function testForm(SignupForm: any, label = '') {
  describe(`Basic Inputs: ${label}`, () => {
    test('it keeps values updated', () => {

      const initialValues = {
        userName: 'Sean',
        password: '',
        email: ''
      };
      const { getByText, getByTestId, component } = render(SignupForm, {
        initialValues,
        validate: () => { }
      });

      expect(get(component.form.values)).toEqual(initialValues);

      const userName = getByTestId('userName') as HTMLInputElement;
      const password = getByTestId('password') as HTMLInputElement;
      const email = getByTestId('email') as HTMLInputElement;
      const awesomeCheckbox = getByTestId('awesomeCheckbox');
      const coolCheckbox = getByTestId('coolCheckbox');
      const pizza = getByTestId('pizza');
      const iceCream = getByTestId('iceCream');

      expect(userName.value).toEqual('Sean');
      expect(password.value).toEqual('');
      expect(email.value).toEqual('');

      userEvent.clear(userName);
      userEvent.type(userName, 'Jacqui');

      // expect(firstName.value).toEqual('Jacqui');
      expect(get(component.form.values)).toEqual({
        userName: 'Jacqui',
        password: '',
        email: ''
      });

      fireEvent.click(awesomeCheckbox);
      fireEvent.click(coolCheckbox);
      fireEvent.click(pizza);

      expect(get(component.form.values)).toEqual({
        userName: 'Jacqui',
        password: '',
        email: '',
        awesome: ['awesome!', 'cool'],
        food: 'pizza'
      });

      fireEvent.click(pizza);

      expect(get(component.form.values)).toEqual({
        userName: 'Jacqui',
        password: '',
        email: '',
        awesome: ['awesome!', 'cool'],
        food: 'pizza'
      });
    });

    test('it tracks errors', async () => {
      const { getByTestId, component } = render(SignupForm, {
        validate
      });

      await wait();

      expect(get(component.form.errors)).toEqual({
        awesome: 'Required',
        email: 'Required',
        jobType: 'Required',
        password: 'Required',
        userName: 'Required'
      });

      const userName = getByTestId('userName') as HTMLInputElement;
      const password = getByTestId('password') as HTMLInputElement;
      const jobType = getByTestId('jobType') as HTMLSelectElement;
      const email = getByTestId('email') as HTMLInputElement;
      const awesomeCheckbox = getByTestId('awesomeCheckbox')

      userEvent.type(userName, 's{backspace}');
      fireEvent.input(userName);
      fireEvent.blur(userName);

      expect(get(component.form.values)).toEqual({
        userName: '',
        password: '',
        email: '',
        awesome: [],
        food: ''
      });

      expect(get(component.form.touched)).toEqual({
        userName: true
      });

      await wait();

      // FIXME: Not sure why this needs to wait to update. Should work the same as touched
      expect(get(component.form.errors)).toEqual({
        userName: 'Required',
        password: 'Required',
        jobType: 'Required',
        email: 'Required',
        awesome: 'Required'
      });

      const lazyBum = getByTestId('lazyBum');

      userEvent.type(userName, 'svelte');
      userEvent.type(password, 'awesome');
      userEvent.type(email, 'email');
      userEvent.selectOptions(jobType, lazyBum);
      fireEvent.click(awesomeCheckbox);

      await wait();

      expect(get(component.form.errors)).toEqual({
        email: 'Invalid email address',
        jobType: 'No lazy bums allowed'
      });
    });

    test('form submission', async () => {
      let submitSuccess = false;

      const { getByTestId, component } = render(SignupForm, {
        validate,
        onSubmit: () => {
          submitSuccess = true;
        }
      });

      const submit = getByTestId('submit-btn');

      fireEvent.click(submit);

      await wait();

      expect(submitSuccess).toBe(true);
    });
  });
}

export { };
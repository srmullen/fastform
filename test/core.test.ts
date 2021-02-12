import { get } from 'svelte/store';
import userEvent from '@testing-library/user-event';
import { useForm, useField } from '../src';
import { wait } from './testingUtils';


describe('useForm', () => {
  describe('initialValues', () => {
    test('it sets initial values', () => {
      const initialValues = {
        name: 'Sean',
        year: 2021
      };
      const form = useForm({ initialValues });
      const values = get(form.values);
      expect(values).toEqual(initialValues);
    });
  });

  describe('validate', () => {
    test('it creates errors on form initialization', async () => {
      const validate = (values) => {
        const errors: { name?: string } = {};
        if (!values.name) {
          errors.name = 'required';
        }
        return errors;
      }

      const form = useForm({ validate });
      await wait();
      const errors = get(form.errors);
      expect(errors.name).toEqual('required');
    });
  });

  describe('value', () => {
    test('the value is set in valueMap', () => {
      const form = useForm();
      const el = document.createElement('div');
      expect(form.valueMap.get(el)).toBeUndefined();
      form.value(el, 42);
      expect(form.valueMap.get(el)).toEqual(42);
    });
  });

  describe('props', () => {
    test('checkbox', () => {
      const form = useForm();
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      form.props(checkbox, { name: 'number', value: 42 });
      expect(form.valueMap.get(checkbox)).toEqual(42);
      expect(form.getValue('number')).toBeUndefined();
      checkbox.click();
      expect(form.getValue('number')).toEqual([42]);
    });

    test('radio', () => {
      const form = useForm();
      const radio1 = document.createElement('input');
      const radio2 = document.createElement('input');
      radio1.type = 'radio';
      radio2.type = 'radio';
      form.props(radio1, { name: 'number', value: 11 });
      form.props(radio2, { name: 'number', value: 42 });
      expect(form.valueMap.get(radio1)).toEqual(11);
      expect(form.valueMap.get(radio2)).toEqual(42);
      expect(form.getValue('number')).toBeUndefined();
      radio1.click();
      expect(form.getValue('number')).toEqual(11);
      radio2.click();
      expect(form.getValue('number')).toEqual(42);
    });

    test('select', () => {
      const form = useForm();
      const select = document.createElement('select');
      const option1 = document.createElement('option');
      const option2 = document.createElement('option');
      select.add(option1);
      select.add(option2);
      form.value(option1, { title: 'Option 1' });
      form.value(option2, { title: 'Option 2' });
      form.props(select, { name: 'myselect' });
      expect(form.getValue('myselect')).toBeUndefined();
      userEvent.selectOptions(select, option1);
      expect(form.getValue('myselect')).toEqual({ title: 'Option 1' });
      userEvent.selectOptions(select, option2);
      expect(form.getValue('myselect')).toEqual({ title: 'Option 2' });
    });
  });
});

describe('useField', () => {
  test('it runs', () => {
    const form = useForm({});
    const field = useField({ name: 'username' }, () => form);
    expect(field).toBeDefined();
  });

  describe('value', () => {
    test('action', () => {
      const form = useForm();
      const field = useField({ name: 'username' }, () => form);
      const el = document.createElement('div');
      const fieldValue = { title: 'fieldvalue' };
      field.value(el, fieldValue);
      expect(form.valueMap.get(el)).toEqual(fieldValue);
    });

    test('set', () => {
      const form = useForm({});
      const field = useField({ name: 'username' }, () => form);
      expect(form.getValue('username')).toBeUndefined();
      field.value.set('seano');
      expect(form.getValue('username')).toEqual('seano');
    });

    test('update', () => {
      const form = useForm({ initialValues: { number: 1 } });
      const field = useField({ name: 'number' }, () => form);
      expect(form.getValue('number')).toEqual(1);
      field.value.update(n => n + 4);
      expect(form.getValue('number')).toEqual(5);
    });
  });
});
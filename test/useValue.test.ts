import { get } from 'svelte/store';
import { fireEvent, render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import UseValue from './components/UseValue.svelte';

describe('use:form.value', () => {
  describe('select element', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    test('it sets initial values', () => {
      const { component } = render(UseValue, {
        options,
        name: 'myselect',
        type: 'select',
        initialValues: {
          myselect: options[1]
        }
      });

      const values = get<any>(component.form.values);
      expect(values.myselect).toEqual(options[1]);
    });

    test('it tracks the values', () => {
      const name = 'myselect';

      const { component, getByTestId } = render(UseValue, {
        options,
        name,
        type: 'select'
      });

      const select = getByTestId(name) as HTMLSelectElement;

      expect(get(component.form.values)).toEqual({});

      userEvent.selectOptions(select, select.options[1]);

      {
        const values = get<any>(component.form.values);
        expect(values[name]).toEqual(options[1]);
        expect(values[name]).not.toEqual(options[2]);
      }
    });
  });

  describe('radio element', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    test('it sets initial values', () => {
      const { component } = render(UseValue, {
        options,
        name: 'myradios',
        type: 'radio',
        initialValues: {
          myradios: options[0]
        }
      });

      const values = get<any>(component.form.values);
      expect(values.myradios).toEqual(options[0]);
    });

    test('it tracks the values', () => {
      const name = 'radios';

      const { component, getByTestId } = render(UseValue, {
        options,
        name,
        type: 'radio'
      });

      const radios = [];
      for (let i = 0; i < options.length; i++) {
        radios.push(getByTestId(`radio${i}`));
      }

      expect(get(component.form.values)).toEqual({});

      fireEvent.click(radios[0]);

      {
        const values = get<any>(component.form.values);
        expect(values[name]).toEqual(options[0]);
      }

      fireEvent.click(radios[2]);

      {
        const values = get<any>(component.form.values);
        expect(values[name]).toEqual(options[2]);
      }
    });
  });

  describe('checkbox elements', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    test('it sets initial values', () => {
      const { component } = render(UseValue, {
        options,
        name: 'mycheckboxes',
        type: 'checkbox',
        initialValues: {
          mycheckboxes: options[2]
        }
      });

      const values = get<any>(component.form.values);
      expect(values.mycheckboxes).toEqual(options[2]);
    });

    test('it tracks the values', () => {
      const name = 'checkboxes';

      const { component, getByTestId } = render(UseValue, {
        options,
        name,
        type: 'checkbox'
      });

      const checkboxes = [];
      for (let i = 0; i < options.length; i++) {
        checkboxes.push(getByTestId(`checkbox${i}`));
      }

      expect(get(component.form.values)).toEqual({});

      fireEvent.click(checkboxes[0]);

      {
        const values = get<any>(component.form.values);
        expect(values[name]).toContain(options[0]);
        expect(values[name]).not.toContain(options[1]);
        expect(values[name]).not.toContain(options[2]);
      }

      fireEvent.click(checkboxes[2]);

      {
        const values = get<any>(component.form.values);
        expect(values[name]).toContain(options[0]);
        expect(values[name]).not.toContain(options[1]);
        expect(values[name]).toContain(options[2]);
      }

      fireEvent.click(checkboxes[0]);

      {
        const values = get<any>(component.form.values);
        expect(values[name]).not.toContain(options[0]);
        expect(values[name]).not.toContain(options[1]);
        expect(values[name]).toContain(options[2]);
      }
    });
  });
});
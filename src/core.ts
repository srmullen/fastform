import { getContext, hasContext } from 'svelte';
import { writable, derived } from 'svelte/store';
import type { FormState, FormOpts, Values, Errors, Touched } from './types';
import { FORM } from './contexts';
import { getIn, setIn, isArray, isObject, getNodeType } from './utils';

export function useForm(opts: FormOpts = {}): FormState {
  const initialValues = opts.initialValues ? opts.initialValues : {};
  const values = writable<Values>(initialValues);
  const errors = writable<Errors>({});
  const touched = writable<Touched>({});
  const submitting = writable(false);

  let _values: Values;
  let _errors: Errors;
  let _touched: Touched;

  const valueMap = new Map<HTMLElement, any>();

  values.subscribe(values => {
    _values = values;
  });

  errors.subscribe(errors => {
    _errors = errors;
  });

  touched.subscribe(touched => {
    _touched = touched;
  });

  async function runValidations(vals: Values) {
    if (opts.validate) {
      errors.set(await opts.validate(vals));
    }
  }

  function getNodeValue(node: HTMLElement) {
    if (valueMap.has(node)) {
      return valueMap.get(node);
    } else {
      return (node as HTMLInputElement).value;
    }
  }

  const handleSubmit = async () => {
    let errors: Errors = {};
    submitting.set(true);
    if (opts.validate) {
      errors = await opts.validate(_values);
    }

    if (opts.onSubmit) {
      await opts.onSubmit(_values, errors);
    }
    submitting.set(false);
  }

  const handleBlur = (event: Event) => {
    const target = event.target as HTMLInputElement;
    touched.update(previous => {
      previous[target.name] = true;
      return previous;
    });
  }

  const handleInput = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    values.update(previous => {
      return setIn(previous, target.name, target.value);
    });
    await runValidations(_values);
  }

  const handleSelect = async (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const option = target.options[target.selectedIndex];
    values.update(previous => {
      return setIn(previous, target.name, getNodeValue(option));
    });
    await runValidations(_values);
  }

  const handleCheckbox = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    values.update(previous => {
      let val: any[];
      const value = getNodeValue(target);
      if (target.checked) {
        const arr = getIn(previous, target.name) || [];
        val = arr.concat(value);
      } else {
        const arr = getIn(previous, target.name) || [];
        val = arr.filter((el: any) => el !== value);
      }
      return setIn(previous, target.name, val);
    });
    runValidations(_values);
  }

  const handleRadio = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    values.update(previous => {
      return setIn(previous, target.name, getNodeValue(target));
    });

    runValidations(_values)
  }

  function attachListeners(node: HTMLElement, listeners: { [key: string]: (e: Event) => Promise<void> | void}) {
    for (let key in listeners) {
      node.addEventListener(key, listeners[key]);
    }

    return {
      destroy() {
        for (let key in listeners) {
          node.removeEventListener(key, listeners[key]);
        }
      }
    }
  }

  function getDefaultFieldProps(node: HTMLInputElement, name: string, type: string | undefined) {
    node.name = name;
    if (type && type !== 'textarea') {
      node.type = type;
    }
    node.value = getIn(_values, name) || '';

    return attachListeners(node, {
      input: handleInput,
      blur: handleBlur
    });
  }
  
  function getCheckboxFieldProps(node: HTMLInputElement, name: string, value: any) {
    node.name = name;
    // store node value
    valueMap.set(node, value);
    // Set initial checkbox value
    let initial = getIn(_values, name);
    if (isArray(initial)) {
      node.checked = initial.includes(value);
    }

    return attachListeners(node, {
      input: handleCheckbox,
      blur: handleBlur
    });
  }

  function getRadioFieldProps(node: HTMLInputElement, name: string, value: any) {
    node.name = name;
    // store radio value
    valueMap.set(node, value);
    // set initial value
    const initial = getIn(_values, name);
    node.checked = initial === value;

    return attachListeners(node, {
      input: handleRadio,
      blur: handleBlur
    });
  }

  function getSelectFieldProps(node: HTMLSelectElement, name: string) {
    const initial = getIn(_values, name);
    
    // node.value = initial;
    let selectedIndex = node.selectedIndex;
    for (let i = 0; i < node.options.length; i++) {
      if (initial === getNodeValue(node.options[i])) {
        selectedIndex = i;
        break;
      }
    }
    node.selectedIndex = selectedIndex;

    return attachListeners(node, {
      input: handleSelect,
      blur: handleBlur
    });
  }

  function getValue(name: string) {
    return getIn(_values, name);
  }

  function props(
    node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, 
    field: string | { name: string, type?: string, value?: any }
  ) {
    let name: string;
    let type: string | undefined = getNodeType(node);
    let value;
    if (typeof field === 'string') {
      name = field;
      value = node.value;
    } else {
      name = field.name;
      type = field.type ? field.type : type;
      value = field.value;
    }
    node.name = name;

    if (type === 'checkbox') {
      return getCheckboxFieldProps(node as HTMLInputElement, name, value);
    } else if (type === 'radio') {
      return getRadioFieldProps(node as HTMLInputElement, name, value);
    } else if (type === 'select') {
      return getSelectFieldProps(node as HTMLSelectElement, name);
    } else {
      return getDefaultFieldProps(node as HTMLInputElement, name, type);
    }
  }

  // Action
  function value(node: HTMLElement, val: any) {
    valueMap.set(node, val);
  }

  runValidations(initialValues);

  const form = {
    // Stores
    values,
    errors,
    touched,
    submitting,

    // Event handlers
    handleSubmit,
    handleBlur,
    handleInput,
    handleCheckbox,
    handleRadio,

    // Actions
    props,
    value,

    // Misc.
    validate: opts.validate,
    getValue,
    valueMap
  }

  return form;
}

/**************************************************************************************************/
/**************************************************************************************************/
/**************************************************************************************************/
/**************************************************************************************************/
/**************************************************************************************************/
/**************************************************************************************************/
/**************************************************************************************************/

export function getFormInContext(context=FORM) {
  if (!hasContext(context)) {
    throw new Error('useField must have a context');
  }
  const { form } = getContext<{ form: FormState }>(context);
  return form;
}

export function useField(
  field: string | { name: string, value?: any, type?: string },
  getForm = getFormInContext
) {

  let input: { name: string, value?: any, type?: string };
  if (typeof field === 'string') {
    input = { name: field };
  } else {
    input = field;
  }

  const form = getForm();

  let _values: Values;
  let _errors: Errors;
  let _touched: Touched;

  form.values.subscribe(values => {
    _values = values;
  });

  form.errors.subscribe(errors => {
    _errors = errors;
  });

  form.touched.subscribe(touched => {
    _touched = touched;
  });

  const valueStore = derived(form.values, $values => {
    return getIn($values, input.name);
  });

  function value(node: HTMLElement, val: any) {
    form.valueMap.set(node, val);
  }

  value.subscribe = valueStore.subscribe;
  value.set = async (val: any) => {
    form.values.update(previous => {
      return Object.assign({}, previous, { [input.name]: val });
    });

    if (form.validate) {
      form.errors.set(await form.validate(_values));
    }
  }
  value.update = (updater: (val: any) => any) => {
    value.set(updater(_values[input.name]));
  }

  const errorStore = derived(form.errors, $errors => {
    return $errors[input.name];
  });

  const error = {
    subscribe: errorStore.subscribe,
    set(err: any) {
      form.errors.update(previous => {
        return Object.assign({}, previous, { [input.name]: err });
      });
    },
    update(updater: (err: any) => any) {
      error.set(updater(_errors[input.name]));
    }
  };

  const touchedStore = derived(form.touched, $touched => {
    return $touched[input.name];
  });

  const touched = {
    subscribe: touchedStore.subscribe,
    set(touch: boolean) {
      form.touched.update(previous => {
        return Object.assign({}, previous, { [input.name]: touch });
      });
    },
    update(updater: (touch: boolean) => boolean) {
      touched.set(updater(_touched[input.name]));
    }
  };

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value.set(target.value);
  }

  function props(node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
    return form.props(node, { name: input.name, type: input.type, value: isObject(field) ? field.value : null });
  }

  return {
    value,
    error,
    touched,
    name: input.name,
    handleInput,
    handleBlur: form.handleBlur,
    props
  };
}
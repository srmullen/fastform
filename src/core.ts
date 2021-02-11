import { getContext, hasContext } from 'svelte';
import { Writable, writable, derived } from 'svelte/store';
import type { FormData, FormOpts, Values, Errors, Touched } from './types';
import { FORM } from './contexts';
import { getIn, setIn, isArray, isObject, getNodeType } from './utils';

export function useForm(opts: FormOpts): FormData {
  const values = writable<Values>(opts.initialValues ? opts.initialValues : {});
  const errors = writable<Errors>({});
  const touched = writable<Touched>({});

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
    if (opts.validate) {
      errors = await opts.validate(_values);
    }

    if (opts.onSubmit) {
      opts.onSubmit(_values, errors);
    }
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
    if (type) {
      node.type = type;
    }
    node.value = _values[name] || '';

    return attachListeners(node, {
      input: handleInput,
      blur: handleBlur
    })
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

  function getFieldProps(
    node: HTMLInputElement | HTMLSelectElement, 
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

  const form = {
    values,
    errors,
    touched,
    valueMap,
    handleSubmit,
    handleBlur,
    handleInput,
    handleCheckbox,
    handleRadio,
    getFieldProps,
    validate: opts.validate,
    getValue,
    value
  }

  return form;
}

function useTextField(form: FormData, name: string) {}

function useCheckboxField(form: FormData, name: string, val: any) {

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
    return getIn($values, name);
  });

  const value = {
    subscribe: valueStore.subscribe,
    async set(checked: boolean) {
      form.values.update(previous => {
        if (checked) {
          const arr = getIn(previous, name) || [];
          val = arr.concat(value);
        } else {
          const arr = getIn(previous, name) || [];
          val = arr.filter((el: any) => el !== value);
        }
        return setIn(previous, name, val);
      });

      if (form.validate) {
        form.errors.set(await form.validate(_values));
      }
    }
  }

  const errorStore = derived(form.errors, $errors => {
    return $errors[name];
  });

  const error = {
    subscribe: errorStore.subscribe,
    set(err: any) {
      form.errors.update(previous => {
        return Object.assign({}, previous, { [name]: err });
      });
    }
  };

  const touchedStore = derived(form.touched, $touched => {
    return $touched[name];
  });

  const touched = {
    subscribe: touchedStore.subscribe,
    set(touch: boolean) {
      form.touched.update(previous => {
        return Object.assign({}, previous, { [name]: touch });
      });
    }
  };

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value.set(target.checked);
  }

  return {
    value,
    error,
    touched,
    name,
    handleInput,
    handleBlur: form.handleBlur,
  };
}

export function useField(
  field: { name: string, value?: any, type?: string }
) {

  if (!hasContext(FORM)) {
    throw new Error('useField must have a context');
  }
  const { form } = getContext<{ form: FormData }>(FORM);
  
  // let name: string;
  // if (typeof field === 'string') {
  //   name = field;
  // } else {
  //   name = field.name;
  // }
  // const {
  //   name,
  //   value,
  //   type
  // } = field;

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
    return getIn($values, field.name);
  });

  const value = {
    subscribe: valueStore.subscribe,
    async set(val: any) {
      form.values.update(previous => {
        return Object.assign({}, previous, { [field.name]: val });
      });

      if (form.validate) {
        form.errors.set(await form.validate(_values));
      }
    }
    // update(fn: (val: any) => any) {
    //   const previous =
    //   fn()
    // }
  }

  const errorStore = derived(form.errors, $errors => {
    return $errors[field.name];
  });

  const error = {
    subscribe: errorStore.subscribe,
    set(err: any) {
      form.errors.update(previous => {
        return Object.assign({}, previous, { [field.name]: err });
      });
    }
  };

  const touchedStore = derived(form.touched, $touched => {
    return $touched[field.name];
  });

  const touched = {
    subscribe: touchedStore.subscribe,
    set(touch: boolean) {
      form.touched.update(previous => {
        return Object.assign({}, previous, { [field.name]: touch });
      });
    }
  };

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value.set(target.value);
  }

  function props(node: HTMLInputElement) {
    return form.getFieldProps(node, { name: field.name, type: field.type, value: isObject(field) ? field.value : null });
  }

  return {
    value,
    error,
    touched,
    name: field.name,
    handleInput,
    handleBlur: form.handleBlur,
    props
  };
}
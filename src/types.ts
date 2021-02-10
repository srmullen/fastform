import type { Writable } from 'svelte/store';

export interface Values {
  [key: string]: any;
}

export interface Errors {
  [key: string]: any;
}

export interface Touched {
  [key: string]: boolean;
}

export interface FormOpts {
  initialValues?: Values,
  validate?: ValidateFn;
  onSubmit?: SubmitFn;
}

export interface Destoryable {
  destroy: (...args: any[]) => void;
}

export interface FormData {
  values: Writable<Values>;
  errors: Writable<Errors>;
  touched: Writable<Touched>;
  // checkboxes: Map<HTMLInputElement, any>;
  // radios: Map<HTMLInputElement, any>;
  valueMap: Map<HTMLElement, any>;
  handleSubmit: (event: Event) => Promise<unknown> | unknown;
  handleBlur: (event: Event) => Promise<any> | any;
  handleInput: (event: Event) => Promise<unknown> | unknown;
  handleCheckbox: (event: Event) => Promise<void> | void;
  handleRadio: (event: Event) => Promise<void> | void;
  getFieldProps: (node: HTMLInputElement | HTMLSelectElement, name: string | { name: string, type?: string, value?: any }) => Destoryable;
  getValue: (name: string) => any;
  validate?: ValidateFn;
  value: (node: HTMLElement, val: any) => void;
}

export type ValidateFn = (values: Values) => Promise<Errors> | Errors;
export type SubmitFn = (values: Values, errors: Errors) => void;
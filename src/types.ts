import type { Writable, Readable } from 'svelte/store';

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

export type ValidateFn = (values: Values) => Promise<Errors> | Errors;
export type SubmitFn = (values: Values, errors: Errors) => Promise<unknown | undefined> | unknown | undefined;

export interface FormState {
  // Stores
  values: Writable<Values>;
  errors: Writable<Errors>;
  touched: Writable<Touched>;
  submitting: Writable<boolean>;

  // Actions
  props: (node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, name: string | { name: string, type?: string, value?: any }) => Destoryable;
  value: (node: HTMLElement, val: any) => void;

  // Event handlers
  handleSubmit: (event: Event) => Promise<unknown> | unknown;
  handleBlur: (event: Event) => Promise<any> | any;
  handleInput: (event: Event) => Promise<unknown> | unknown;
  handleCheckbox: (event: Event) => Promise<void> | void;
  handleRadio: (event: Event) => Promise<void> | void;

  // Misc.
  getValue: (name: string) => any;
  validate?: ValidateFn;
  valueMap: Map<HTMLElement, any>;
}
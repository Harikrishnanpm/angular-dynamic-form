import { Subject } from 'rxjs';

export interface IDictionary<T> {
  [key: string]: T;
}

export enum DynamicFormControlType {
  text,
  radio,
  select,
  checkbox,
  textArea,
  multiSelect,
  datePicker,
  dateRangePicker
}

export const DYNAMIC_FORM_VALIDATION_TYPES = {
  MIN: 'min',
  MAX: 'max',
  EMAIL: 'email',
  PATTERN: 'pattern',
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  CUSTOM_VALIDATIONS: 'customValidations'
};

export const DYNAMIC_FORM_BUTTON_TYPES = {
  SUBMIT: 'SUBMIT',
  CANCEL: 'CANCEL'
};

export interface IDynamicFormCustomValidation {
  validator: any;
  validationMessage: string;
}

export const DYNAMIC_FORM_ACTION_FROM_PARENT = {
  CLEAR: 'clear',
  SUBMIT: 'submit'
};

export interface IDynamicFormValidationObject {
  email?: boolean;
  pattern?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  customValidations?: IDynamicFormCustomValidation[];
}

interface IDynamicFormControlOption<T> {
  value: T;
  key: string;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  maskString?: string;
  autocomplete?: 'on' | 'off';
  validation?: IDynamicFormValidationObject;
}

interface IDateRangeValueModel {
  form: string;
  to: string;
}

export interface IDynamicFormControlUpdateDataModel<T, U> {
  key: string;
  type: DynamicFormControlType;
  newValue?: T;
  newOptions?: U[];
  validations?: IDynamicFormValidationObject;
}


interface IDynamicSelectFormControlOption<T, U> extends IDynamicFormControlOption<T> {
  data: U[];
  dataIdParam?: string;
  dataValueParam?: string;
}

interface IDynamicDateFormControlOption<T> extends IDynamicFormControlOption<T> {
  dateFormat: string;
  isTouchUi?: boolean;
}

interface IDynamicFormRadioControlOption {
  label: string;
  value: string;
}

interface IDynamicRadioFormControlOption extends IDynamicFormControlOption<string> {
  options: IDynamicFormRadioControlOption[];
}

export interface IDynamicFormControlValueChangeModel {
  key: string;
  value: any;
}


/**
 * Base class for all dynamic form controls.
 * @export
 * @class DynamicFormControlBase
 * @implements {IDynamicFormControlOption<T>}
 * @template T
 */
export class DynamicFormControlBase<T> implements IDynamicFormControlOption<T> {

  public value: T;
  public key: string;
  public label: string;
  public maskString: string;
  public isDisabled: boolean;
  public isRequired: boolean;
  public placeholder: string;
  public autocomplete: 'on' | 'off';
  public onChange: () => any;
  public type: DynamicFormControlType;
  public validation: IDynamicFormValidationObject;

  constructor(option: IDynamicFormControlOption<T>, type: DynamicFormControlType) {
    this.type = type;
    this.key = option.key;
    this.value = option.value;
    this.label = option.label;
    this.maskString = option.maskString;
    this.isDisabled = option.isDisabled;
    this.isRequired = option.isRequired;
    this.validation = option.validation;
    this.autocomplete = option.autocomplete || 'off';
    this.placeholder = option.placeholder || option.label;
  }
}

export class DynamicFormControlSelect<T, U> extends DynamicFormControlBase<T> implements IDynamicSelectFormControlOption<T, U> {
  data: U[];
  dataIdParam: string;
  dataValueParam: string;
  constructor(option: IDynamicSelectFormControlOption<T, U>, type: DynamicFormControlType) {
    super(option, type);
    this.data = option.data;
    this.dataIdParam = option.dataIdParam;
    this.dataValueParam = option.dataValueParam;
  }
}

export class DynamicFormControlDate<T> extends DynamicFormControlBase<T> implements IDynamicDateFormControlOption<T> {
  dateFormat: string;
  isTouchUi: boolean;
  constructor(option: IDynamicDateFormControlOption<T>, type: DynamicFormControlType) {
    super(option, type);
    this.isTouchUi = option.isTouchUi;
    this.dateFormat = option.dateFormat;
  }
}

export class DynamicFormControlRadio extends DynamicFormControlBase<string> implements IDynamicRadioFormControlOption {
  options: IDynamicFormRadioControlOption[];
  constructor(option: IDynamicRadioFormControlOption, type: DynamicFormControlType) {
    super(option, type);
    this.options = option.options;
  }
}

export class TextFormControl extends DynamicFormControlBase<string> {
  constructor(option: IDynamicFormControlOption<string>) {
    super(option, DynamicFormControlType.text);
  }
}

export class TextAreaFormControl extends DynamicFormControlBase<string> {
  constructor(option: IDynamicFormControlOption<string>) {
    super(option, DynamicFormControlType.textArea);
  }
}

export class SelectFormControl<T> extends DynamicFormControlSelect<string, T> {
  constructor(option: IDynamicSelectFormControlOption<string, T>) {
    super(option, DynamicFormControlType.select);
  }
}

export class EmptyFormControl extends DynamicFormControlBase<string> {
  constructor() {
    super({
      value: null,
      key: null,
      label: null
    }, null);
  }
}


export class MultiSelectFormControl<T> extends DynamicFormControlSelect<string[], T> {
  constructor(option: IDynamicSelectFormControlOption<string[], T>) {
    super(option, DynamicFormControlType.multiSelect);
  }
}

export class CheckboxFormControl extends DynamicFormControlBase<boolean> {
  constructor(option: IDynamicFormControlOption<boolean>) {
    super(option, DynamicFormControlType.checkbox);
  }
}

export class DatePickerFormControl extends DynamicFormControlDate<string> {
  constructor(option: IDynamicDateFormControlOption<string>) {
    super(option, DynamicFormControlType.datePicker);
  }
}

export class DateRangePickerFormControl extends DynamicFormControlDate<IDateRangeValueModel> {
  constructor(option: IDynamicDateFormControlOption<IDateRangeValueModel>) {
    super(option, DynamicFormControlType.dateRangePicker);
  }
}

export class RadioFormControl extends DynamicFormControlRadio {
  constructor(option: IDynamicRadioFormControlOption) {
    super(option, DynamicFormControlType.radio);
  }
}

export interface IDynamicFormSubmitSubjectData {
  isValid: boolean;
  formData: any;
}

export interface IDynamicFormConfig {
  formActionSubject?: Subject<string>;
  formSubmitSubject?: Subject<IDynamicFormSubmitSubjectData>;
  controlUpdateObservable?: Subject<IDynamicFormControlUpdateDataModel<any, any>>;
  controlValueChangeObservable?: Subject<IDynamicFormControlValueChangeModel>;
  controls: any;
  formButtons?: {
    type: string;
  }[];
  // TODO: (TextFormControl | SelectFormControl<any> | MultiSelectFormControl<any> | CheckboxFormControl
  // TODO: | DatePickerFormControl | DateRangePickerFormControl)[][];
}

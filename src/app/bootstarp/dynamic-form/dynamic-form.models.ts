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
  dateRangePicker,
  combinationFormControl
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

export interface IDynamicFormControlCustomValidation {
  validator: any;
  validationMessage: string;
}


export interface IDynamicFormCustomValidation extends IDynamicFormControlCustomValidation {
  controlKeyName: string;
}

export enum DynamicFormSubmitAction {
  clear,
  submit
}

export interface IDynamicFormValidationObject {
  email?: boolean;
  pattern?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  customValidations?: IDynamicFormControlCustomValidation[];
}

interface IDynamicFormControlOption<T> {
  value?: T | T[];
  key: string;
  label: string;
  isAddable?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  maskString?: string;
  autocomplete?: 'on' | 'off';
  maskAllowedSpecialCharacters?: string[];
  validation?: IDynamicFormValidationObject;
}

interface IDateRangeValueModel {
  from?: string | Date;
  to?: string | Date;
}

export interface IDynamicFormControlUpdateDataModel<T, U> {
  newValue?: T;
  newOptions?: U[];
  childKey?: string;
  parentKey?: string;
  itemRowIndex?: number;
  type: DynamicFormControlType;
  validations?: IDynamicFormValidationObject;
}


interface IDynamicSelectFormControlOption<T, U> extends IDynamicFormControlOption<T> {
  data: U[];
  dataIdParam?: string;
  enableSearch?: boolean;
  dataValueParam?: string;
}

interface IDynamicDateFormControlOption<T> extends IDynamicFormControlOption<T> {
  dateFormat: string;
  isTouchUi?: boolean;
  isAddable?: boolean;
  dateRange?: IDateRangeValueModel;
}

interface IDynamicFormRadioControlOption {
  label: string;
  value: string;
}

interface IDynamicRadioFormControlOption extends IDynamicFormControlOption<string> {
  options: IDynamicFormRadioControlOption[];
}

export interface IDynamicFormControlValueChangeModel {
  parentKey?: string;
  itemRow?: number;
  childKey?: string;
  value?: any;
}


/**
 * Base class for all dynamic form controls.
 * @export
 * @class DynamicFormControlBase
 * @implements {IDynamicFormControlOption<T>}
 * @template T
 */
export class DynamicFormControlBase<T> implements IDynamicFormControlOption<T> {

  public value?: T | T[];
  public key: string;
  public label: string;
  public isAddable: boolean;
  public maskString: string;
  public isDisabled: boolean;
  public isRequired: boolean;
  public placeholder: string;
  public autocomplete: 'on' | 'off';
  public onChange: () => any;
  public type: DynamicFormControlType;
  public maskAllowedSpecialCharacters: string[];
  public validation: IDynamicFormValidationObject;

  constructor(option: IDynamicFormControlOption<T>, type: DynamicFormControlType) {
    this.type = type;
    this.key = option.key;
    this.label = option.label || '';
    this.value = option.value || null;
    this.isAddable = option.isAddable;
    this.maskString = option.maskString;
    this.isDisabled = option.isDisabled;
    this.isRequired = option.isRequired;
    this.validation = option.validation;
    this.autocomplete = option.autocomplete || 'off';
    this.placeholder = option.placeholder || option.label;
    this.maskAllowedSpecialCharacters =
      this.maskAllowedSpecialCharacters || [];
  }
}

export class DynamicFormControlSelect<T, U> extends DynamicFormControlBase<T> implements IDynamicSelectFormControlOption<T, U> {
  data: U[];
  dataIdParam: string;
  enableSearch: boolean;
  dataValueParam: string;
  constructor(option: IDynamicSelectFormControlOption<T, U>, type: DynamicFormControlType) {
    super(option, type);
    this.data = option.data;
    this.dataIdParam = option.dataIdParam;
    this.enableSearch = option.enableSearch || false;
    this.dataValueParam = option.dataValueParam;
  }
}

export class DynamicFormControlDate<T> extends DynamicFormControlBase<T> implements IDynamicDateFormControlOption<T> {
  dateFormat: string;
  isTouchUi: boolean;
  isAddable: boolean;
  dateRange: IDateRangeValueModel;
  constructor(option: IDynamicDateFormControlOption<T>, type: DynamicFormControlType) {
    super(option, type);
    this.isAddable = option.isAddable;
    this.isTouchUi = option.isTouchUi;
    const currentYear = new Date().getFullYear();
    this.dateRange = {
      from: option.dateRange && option.dateRange.from ? option.dateRange.from : new Date(currentYear - 150, 0, 1),
      to: option.dateRange && option.dateRange.to ? option.dateRange.to : new Date(currentYear + 150, 0, 1)
    };
    this.dateFormat = option.dateFormat ? option.dateFormat : 'MM/DD/YYYY';
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

export class SelectFormControl<T> extends DynamicFormControlSelect<any[], T> {
  constructor(option: IDynamicSelectFormControlOption<any[], T>) {
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

interface ICombinationFormControlOptions {
  key: string;
  label: string;
  isAddable?: boolean;
  value?: object | object[];
  controls: IDynamicFormControl[];
  validation?: IDynamicFormValidationObject;
}

export interface IDynamicFormControl extends Partial<TextFormControl>, Partial<SelectFormControl<any>>,
  Partial<DatePickerFormControl>, Partial<DateRangePickerFormControl>, Partial<CombinationFormControl> {
  value?: any;
}

export interface IDynamicFormControlHtml extends IDynamicFormControl {
  showControlRemove?: boolean;
}

export class CombinationFormControl implements ICombinationFormControlOptions {
  key: string;
  label: string;
  value: object | object[];
  validation: IDynamicFormValidationObject;
  isAddable: boolean;
  type: DynamicFormControlType;
  controls: IDynamicFormControl[];
  constructor(option: ICombinationFormControlOptions) {
    this.key = option.key;
    this.value = option.value;
    this.label = option.label;
    this.isAddable = option.isAddable;
    this.type = DynamicFormControlType.combinationFormControl;
    this.controls = option.controls;
    this.validation = option.validation;
  }
}

export interface IDynamicFormSubmitSubjectData<T> {
  isValid: boolean;
  formData: T;
}

export interface IDynamicSelectSettings {
  singleSelection?: boolean;
  text?: string;
  enableCheckAll?: boolean;
  selectAllText?: string;
  unSelectAllText?: string;
  enableSearchFilter?: boolean;
  enableFilterSelectAll?: boolean;
  filterSelectAllText?: string;
  filterUnSelectAllText?: string;
  maxHeight?: number;
  badgeShowLimit?: number;
  classes?: string;
  limitSelection?: number;
  disabled?: boolean;
  searchPlaceholderText?: string;
  groupBy?: string;
  searchAutofocus?: boolean;
  labelKey?: string;
  primaryKey?: string;
  position?: string;
  noDataLabel?: string;
  searchBy?: string;
  lazyLoading?: boolean;
  showCheckbox?: boolean;
}

export interface IDynamicFormConfig<T> {
  formActionSubject?: Subject<DynamicFormSubmitAction>;
  formSubmitSubject?: Subject<IDynamicFormSubmitSubjectData<T>>;
  controlUpdateObservable?: Subject<IDynamicFormControlUpdateDataModel<any, any>>;
  controlValueChangeObservable?: Subject<IDynamicFormControlValueChangeModel>;
  controls: IDynamicFormControl[][];
  formButtons?: {
    type: DynamicFormSubmitAction;
    label: string;
  }[];
  formValidators?: IDynamicFormCustomValidation[];
}

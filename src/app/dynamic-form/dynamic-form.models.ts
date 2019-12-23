export enum DynamicFormControlType {
  text,
  select,
  checkbox,
  textArea,
  multiSelect,
  datePicker,
  dateRangePicker
}

interface IDynamicFormControlOption<T> {
  value: T;
  key: string;
  label: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}

interface IDateRangeValueModel {
  form: string;
  to: string;
}


interface IDynamicSelectFormControlOption<T, U> extends IDynamicFormControlOption<T> {
  data: U[];
  dataIdParam?: string;
  dataValueParam?: string;
}

interface IDynamicDateFormControlOption<T> extends IDynamicFormControlOption<T> {
  dateFormat: string;
}


export class DynamicFormControlBase<T> implements IDynamicFormControlOption<T> {

  public value: T;
  public key: string;
  public label: string;
  public isDisabled: boolean;
  public isRequired: boolean;
  public type: DynamicFormControlType;

  constructor(option: IDynamicFormControlOption<T>, type: DynamicFormControlType) {
    this.type = type;
    this.key = option.key;
    this.value = option.value;
    this.label = option.label;
    this.isDisabled = option.isDisabled;
    this.isRequired = option.isRequired;
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
  constructor(option: IDynamicDateFormControlOption<T>, type: DynamicFormControlType) {
    super(option, type);
    this.dateFormat = option.dateFormat;
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

// export class EmptyFormControl extends DynamicFormControlBase<string> {
//   constructor(option: IDynamicFormControlOption<string>) {
//     super(option, null);
//   }
// }

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

export interface IDynamicFormConfig {
  controls: any;//(TextFormControl | SelectFormControl<any> | MultiSelectFormControl<any> | CheckboxFormControl
    //| DatePickerFormControl | DateRangePickerFormControl)[][];
}

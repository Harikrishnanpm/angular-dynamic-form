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
    isRequired?: boolean;
}

interface IDynamicFormControlDateOption<T> extends IDynamicFormControlOption<T> {
    dateFormat: string;
}

interface IDateRangeValueModel {
    form: string;
    to: string;
}

export class DynamicFormControlBase<T> implements IDynamicFormControlOption<T> {

    public value: T;
    public key: string;
    public label: string;
    public dateFormat: string;
    public isRequired: boolean;
    public type: DynamicFormControlType;

    constructor(option: IDynamicFormControlOption<T>, type: DynamicFormControlType, dateFormat?: string) {
        this.type = type;
        this.key = option.key;
        this.value = option.value;
        this.label = option.label;
        this.dateFormat = dateFormat;
        this.isRequired = option.isRequired;
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

export class SelectFormControl extends DynamicFormControlBase<string> {
    constructor(option: IDynamicFormControlOption<string>) {
        super(option, DynamicFormControlType.select);
    }
}

export class MultiSelectFormControl extends DynamicFormControlBase<string[]> {
    constructor(option: IDynamicFormControlOption<string[]>) {
        super(option, DynamicFormControlType.select);
    }
}

export class CheckboxFormControl extends DynamicFormControlBase<boolean> {
    constructor(option: IDynamicFormControlOption<boolean>) {
        super(option, DynamicFormControlType.checkbox);
    }
}

export class DatePickerFormControl extends DynamicFormControlBase<string> {
    constructor(option: IDynamicFormControlDateOption<string>) {
        super(option, DynamicFormControlType.datePicker, option.dateFormat);
    }
}

export class DateRangePickerFormControl extends DynamicFormControlBase<IDateRangeValueModel> {
    constructor(option: IDynamicFormControlDateOption<IDateRangeValueModel>) {
        super(option, DynamicFormControlType.dateRangePicker, option.dateFormat);
    }
}

export interface IDynamicFormConfig {
    controls: (TextFormControl | SelectFormControl | MultiSelectFormControl | CheckboxFormControl
        | DatePickerFormControl | DateRangePickerFormControl)[][];
}

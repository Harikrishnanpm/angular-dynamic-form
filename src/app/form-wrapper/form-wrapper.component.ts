import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { IDynamicFormConfig, SelectFormControl, TextFormControl } from '../dynamic-form/dynamic-form.models';
import {
  CheckboxFormControl,
  DYNAMIC_FORM_BUTTON_TYPES,
  DynamicFormControlType,
  IDynamicFormControlUpdateDataModel,
} from './../dynamic-form/dynamic-form.models';

interface ICountry {
  CountryId: number;
  CountryName: string;
}

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.sass']
})
export class FormWrapperComponent implements OnInit, OnDestroy {

  public dynamicFormConfig: IDynamicFormConfig;
  public formControlUpdateSubject = new Subject<IDynamicFormControlUpdateDataModel<any, any>>();
  constructor() { }

  ngOnInit() {
    const countries: ICountry[] = [{
      CountryId: 1,
      CountryName: 'India'
    }, {
      CountryId: 2,
      CountryName: 'Sri Lanka'
    }];
    this.dynamicFormConfig = {
      controlUpdateObservable: this.formControlUpdateSubject,
      controls: [
        [
          new TextFormControl({
            label: 'control3',
            value: '',
            key: 'test3',
            isDisabled: false
          }),
          new CheckboxFormControl({
            label: 'Check me',
            value: false,
            key: 'checkbox'
          }),
          new TextFormControl({
            label: 'control3',
            value: '',
            key: 'test90',
            isDisabled: false
          }),
          new TextFormControl({
            label: 'control3',
            value: '',
            key: 'test56'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: '234234',
            key: 'test4'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test5'
          }),
          new SelectFormControl<ICountry>({
            label: 'control6',
            value: null,
            key: 'test6',
            data: countries,
            dataValueParam: 'CountryName',
            dataIdParam: 'CountryId'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: '234234',
            key: 'test7'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test8'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: '234234',
            key: 'test9'
          }),
          new SelectFormControl({
            label: 'control6',
            value: null,
            key: 'test10',
            data: countries,
            dataValueParam: 'CountryName',
            dataIdParam: 'CountryId'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: '234234',
            key: 'test11'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test12'
          }),
          new SelectFormControl({
            label: 'control6',
            value: null,
            key: 'test13',
            data: countries,
            dataValueParam: 'CountryName',
            dataIdParam: 'CountryId'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: '234234',
            key: 'test14'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test15'
          }),
          new SelectFormControl({
            label: 'control6',
            value: null,
            key: 'test16',
            data: countries,
            dataValueParam: 'CountryName',
            dataIdParam: 'CountryId'
          })
        ]
      ],
      formButtons: [{
        type: DYNAMIC_FORM_BUTTON_TYPES.SUBMIT
      }, {
        type: DYNAMIC_FORM_BUTTON_TYPES.CANCEL,
      }]
    };
  }

  public ngOnDestroy() {
    this.formControlUpdateSubject.unsubscribe();
  }

  public updateChildForm() {
    this.formControlUpdateSubject.next({
      key: 'test6',
      type: DynamicFormControlType.select,
      newOptions: [{
        CountryId: 1,
        CountryName: 'AUS'
      }, {
        CountryId: 2,
        CountryName: 'USA'
      }]
    });
  }

  public onFormSubmit(formData: any) {
    debugger
  }
}

import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.sass']
})
export class ErrorMessageComponent implements OnInit {
  @Input() label: string;
  @Input() dynamicFormControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

}

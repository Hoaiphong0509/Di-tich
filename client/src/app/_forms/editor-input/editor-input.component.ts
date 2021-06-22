import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-editor-input',
  templateUrl: './editor-input.component.html',
  styleUrls: ['./editor-input.component.css']
})
export class EditorInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'text';

  apiKey = environment.apiTinyMCE;
  constructor(@Self() public ngControl: NgControl, private router: Router) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {

  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

}

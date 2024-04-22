import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

  constructor() { }

  public isValidField(field: string, form: FormGroup): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public isFieldOneEquealFieldTwo(field1: string, field2: string): ValidatorFn {
    return ( formGroup: AbstractControl ): ValidationErrors | null => {

      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if ( fieldValue1 !== fieldValue2 ) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    }
  }
}

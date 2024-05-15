import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

  constructor() { }

  /**
   * Comprueba si un campo del formulario es válido y ha sido tocado.
   *
   * @param field: el nombre del campo del formulario.
   * @param form: la instancia de FormGroup.
   * @returns Un booleano que indica si el campo es válido y ha sido tocado.
   */
  public isValidField(field: string, form: FormGroup): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  /**
   * Función de validación personalizada que comprueba si dos campos de formulario tienen el mismo valor.
   *
   * @param field1: el nombre del primer campo del formulario.
   * @param field2: el nombre del segundo campo del formulario.
   * @returns Un ValidatorFn que comprueba si los dos campos tienen el mismo valor.
   */
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

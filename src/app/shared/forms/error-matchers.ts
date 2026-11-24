import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Mostra o campo em erro também quando o grupo tem um erro que envolve esse campo
 * (ex.: término antes do início).
 */
export function crossFieldMatcher(groupErrorKey: string): ErrorStateMatcher {
  return {
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null) {
      if (!control) {
        return false;
      }
      const shown = control.touched || control.dirty || !!form?.submitted;
      return shown && (control.invalid || !!control.parent?.hasError(groupErrorKey));
    },
  };
}

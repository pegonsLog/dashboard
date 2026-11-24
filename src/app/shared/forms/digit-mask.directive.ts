import { Directive, ElementRef, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Máscara simples para campos numéricos com separadores.
 * Ex.: `appDigitMask="00/00"` transforma "0503" em "05/03" enquanto o usuário digita.
 */
@Directive({
  selector: 'input[appDigitMask]',
  host: {
    inputmode: 'numeric',
    '(input)': 'onInput()',
  },
})
export class DigitMaskDirective {
  readonly pattern = input.required<string>({ alias: 'appDigitMask' });

  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly control = inject(NgControl, { self: true, optional: true });

  protected onInput(): void {
    const masked = applyDigitMask(this.element.nativeElement.value, this.pattern());
    if (masked !== this.element.nativeElement.value) {
      this.element.nativeElement.value = masked;
    }
    this.control?.control?.setValue(masked, { emitModelToViewChange: false });
  }
}

/** Aplica a máscara: cada "0" do padrão recebe um dígito; os demais caracteres são fixos. */
export function applyDigitMask(value: string, pattern: string): string {
  const digits = value.replace(/\D/g, '');
  let result = '';
  let index = 0;
  for (const char of pattern) {
    if (index >= digits.length) {
      break;
    }
    if (char === '0') {
      result += digits[index++];
    } else {
      result += char;
    }
  }
  return result;
}

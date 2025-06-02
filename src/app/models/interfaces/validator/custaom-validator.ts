import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static cpfValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value?.replace(/[^\d]/g, '');
      if (!cpf || cpf.length !== 11) return { invalidCPF: true };
      if (/^(\d)\1{10}$/.test(cpf)) return { invalidCPF: true };

      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let digit = 11 - (sum % 11);
      digit = digit > 9 ? 0 : digit;
      if (parseInt(cpf.charAt(9)) !== digit) return { invalidCPF: true };

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      digit = 11 - (sum % 11);
      digit = digit > 9 ? 0 : digit;
      if (parseInt(cpf.charAt(10)) !== digit) return { invalidCPF: true };

      return null;
    };
  }

  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value?.replace(/[^\d]/g, '');
      if (!phone || phone.length < 10 || phone.length > 11) {
        return { invalidPhone: true };
      }
      return null;
    };
  }

  static passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword ? null : { mismatch: true };
  };
}

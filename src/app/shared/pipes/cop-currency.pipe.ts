import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

const WHITESPACE_LIKE = /[\s  ]/g;

@Pipe({ name: 'copCurrency' })
export class CopCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) {
      return '';
    }
    const symbol = getCurrencySymbol('COP', 'narrow', 'es-CO');
    return formatCurrency(value, 'es-CO', symbol, 'COP', '1.0-0').replace(WHITESPACE_LIKE, '');
  }
}

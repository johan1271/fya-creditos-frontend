import { Component } from '@angular/core';

@Component({
  selector: 'app-brand-icon',
  template: `<img src="assets/icon/logo-mark.png" alt="" class="brand-icon" />`,
  styles: `
    .brand-icon {
      display: block;
      height: 26px;
      width: auto;
    }
  `,
})
export class BrandIconComponent {}

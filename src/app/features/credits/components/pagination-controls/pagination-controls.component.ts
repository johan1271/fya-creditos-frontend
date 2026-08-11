import { Component, input, output } from '@angular/core';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pagination-controls',
  templateUrl: 'pagination-controls.component.html',
  styleUrl: 'pagination-controls.component.scss',
  imports: [IonButton, IonIcon],
})
export class PaginationControlsComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly previous = output<void>();
  readonly next = output<void>();

  protected readonly chevronBackOutline = chevronBackOutline;
  protected readonly chevronForwardOutline = chevronForwardOutline;
}

import { Component, input, output } from '@angular/core';
import { gridOutline, layersOutline } from 'ionicons/icons';
import { IonIcon, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';

export type CreditsViewMode = 'cards' | 'table';

@Component({
  selector: 'app-view-mode-switch',
  templateUrl: 'view-mode-switch.component.html',
  styleUrl: 'view-mode-switch.component.scss',
  imports: [IonSegment, IonSegmentButton, IonIcon],
})
export class ViewModeSwitchComponent {
  readonly value = input.required<CreditsViewMode>();
  readonly valueChange = output<CreditsViewMode>();

  protected readonly layersOutline = layersOutline;
  protected readonly gridOutline = gridOutline;

  protected onChange(event: CustomEvent<{ value?: string | number }>): void {
    const next = event.detail.value;
    if (next === 'cards' || next === 'table') {
      this.valueChange.emit(next);
    }
  }
}

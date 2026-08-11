import { Component } from '@angular/core';
import { addCircleOutline, searchOutline } from 'ionicons/icons';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  protected readonly searchOutline = searchOutline;
  protected readonly addCircleOutline = addCircleOutline;
}

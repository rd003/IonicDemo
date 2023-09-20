import {
  Component,
  EnvironmentInjector,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TodoComponent } from './todo/todo.component';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <app-todo />
      <!-- <ion-router-outlet></ion-router-outlet> -->
    </ion-app>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, TodoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {}
}

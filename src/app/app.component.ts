import { Component } from '@angular/core';
import { StateActivator, StateDescriptor, StateValue } from './app.decorators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'auto-context-project';

  activate(instance: any) {
    StateActivator(instance);
  }
}

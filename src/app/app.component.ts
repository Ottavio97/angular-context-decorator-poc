import { Component } from '@angular/core';
import { ContextDescriptor, ContextVar } from './app.decorators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'auto-context-project';

  activate(instance: any) {
    if ('saveContext' in instance) instance.saveContext();
      /*const cxtDescriptor: ContextDescriptor[] = instance?.constructor?.prototype?.__context__;
      if (cxtDescriptor) {
        console.log('Context of ', instance, ':', cxtDescriptor.map(d => ({key: d.key, value: instance[d.variable]})))
      }*/
  }
}

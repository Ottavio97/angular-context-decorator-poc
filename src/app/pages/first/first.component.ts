import { Component, OnInit } from '@angular/core';
import { ComponentStateAware, StateAware, StateDiscriminant, StateValue, StateVar } from 'src/app/app.decorators';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss']
})
export class FirstComponent extends ComponentStateAware implements OnInit, StateAware {

  @StateDiscriminant()
  componentId = 'ciaotest';

  exVar = 'ok';

  cuVar = 'no';

  @StateVar('inputCustom', true)
  inVar: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngOnStateSaved(map: StateValue[]) {
    console.log('EVENT: State Saved', map);
  }

  ngOnStateLoaded() {
    console.log('EVENT: State Loaded');
  }

  ngOnStateCleared() {
    console.log('EVENT: State Cleared');
  }
}

import { Component, OnInit } from '@angular/core';
import { ContextAware, ContextVar, StateAware, StateVar } from 'src/app/app.decorators';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss']
})
export class FirstComponent implements OnInit, ContextAware, StateAware {
  saveContext;
  saveState;

  @ContextVar()
  @StateVar('stateExVar')
  exVar = 'ok';

  @ContextVar('customName')
  @StateVar()
  cuVar = 'no';

  @ContextVar('myInput')
  inVar: string;

  constructor() { }

  ngOnInit(): void {
  }
}

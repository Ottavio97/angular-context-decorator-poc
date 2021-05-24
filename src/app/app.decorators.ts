export interface StateDescriptor {
    key: string;
    variable: string;
    onlyNonNull: boolean;
}

export interface StateValue {
    key: string;
    value: any;
}
export interface StateAware {
    saveState?: (ctx: StateDescriptor[]) => void;
    loadState?: () => void;
    clearState?: () => void;
    ngOnStateSaved?: (mapState?: StateValue[]) => void;
    ngOnStateLoaded?: () => void;
    ngOnStateCleared?: () => void;
}

export class ComponentStateAware implements StateAware {
    saveState;
    loadState;
    clearState;
}

function __defaultSaveState(this: StateAware, stx?: StateDescriptor[]) {
    this.clearState();
    const mapState: StateValue[] = 
        (stx || this.constructor.prototype.__state__ as StateDescriptor[])
        .filter(d => d.onlyNonNull && this[d.variable] || !d.onlyNonNull)
        .map(d => ({key: d.key, value: this[d.variable]}));
    if (mapState?.length > 0) {
        localStorage.setItem('state_' + this.constructor.name, JSON.stringify(mapState));
        if(this.ngOnStateSaved) {
            this.ngOnStateSaved(mapState);
        }
    }
}

function __defaultLoadState(this: StateAware) {
    let stateValues: StateValue[];
    try {
        stateValues = JSON.parse(localStorage.getItem('state_' + this.constructor.name));
    } catch (e) {
        stateValues = undefined;
    }
    
    const descriptor: StateDescriptor[] = this?.constructor?.prototype?.__state__;
    if (descriptor && stateValues) {
      descriptor.forEach(d => {
        const descValue = stateValues.find(v => v.key === d.key);
        if (descValue) {
            this[d.variable] = descValue.value;
        }
      });
      if (this.ngOnStateLoaded) {
          this.ngOnStateLoaded();
      }
    }
}

function __defaultClearState(this: StateAware) {
    localStorage.removeItem('state_' + this.constructor.name);
    if (this.ngOnStateCleared) {
        this.ngOnStateCleared();
    }
}

export function StateVar(key?: string, onlyNonNull = false): (component: any, propertyKey: string) => void {
    return (component, variable) => {
        if (!component.__state__) {
            component.__state__ = [] as StateDescriptor[];
        }
        (component.__state__ as StateDescriptor[]).push({key: key || variable, variable, onlyNonNull});
        if (!component.clearState) {
            Object.defineProperty(component, 'clearState', {
                value: __defaultClearState
            })
        }
        if (!component.saveState) {
            Object.defineProperty(component, 'saveState', {
                value: __defaultSaveState
            })
        }
        if (!component.loadState) {
            Object.defineProperty(component, 'loadState', {
                value: __defaultLoadState
            })
        }
    }
}

export function StateActivator(instance: StateAware) {
    if (instance.loadState) {
        instance.loadState();
    }
}
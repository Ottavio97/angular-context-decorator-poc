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
    stateStorage?: StateStorage;
}

export interface StateStorage {
    save: <T>(key: string, value: T) => T;
    load: <T>(key: string, defaultValue?: T) => T | undefined;
    remove: <T>(key: string) => T;
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
        (this.stateStorage || __defaultStateStorage).save('state_' + this.constructor.name + (this.constructor.prototype?.__discriminant__ ? '_' + this[this.constructor.prototype?.__discriminant__] : ''), mapState);
        if(this.ngOnStateSaved) {
            this.ngOnStateSaved(mapState);
        }
    }
}

function __defaultLoadState(this: StateAware) {
    let stateValues: StateValue[];
    try {
        stateValues = (this.stateStorage || __defaultStateStorage).load('state_' + this.constructor.name + (this.constructor.prototype?.__discriminant__ ? '_' + this[this.constructor.prototype?.__discriminant__] : ''));
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
    (this.stateStorage || __defaultStateStorage).remove('state_' + this.constructor.name + (this.constructor.prototype?.__discriminant__ ? '_' + this[this.constructor.prototype?.__discriminant__] : ''))
    if (this.ngOnStateCleared) {
        this.ngOnStateCleared();
    }
}

const __defaultStateStorage: StateStorage = {
    save: <T>(key: string, value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
    },
    load: <T>(key: string, defaultValue?: T) => {
        try {
            const theValue: string = localStorage.getItem(key);
            if (theValue === null || theValue === undefined)
                return defaultValue;
            return JSON.parse(theValue) as T;
        } catch (e) {
            console.error('Error parsing State Storage key ', key, ': ', e);
            return defaultValue;
        }
    },
    remove: <T>(key: string) => {
        const theValue: string = localStorage.getItem(key);
        if (theValue === null || theValue === undefined){
            console.warn('No State Storage key found: ', key, '. Abort removing.');
        }
        localStorage.removeItem(key);
        return JSON.parse(theValue);
    }
};

export function StateDiscriminant(): (component: any, propertyKey: string) => void {
    return (component, variable) => {
        component.__discriminant__ = variable;
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
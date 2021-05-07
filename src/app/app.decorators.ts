export interface GeneralDataDescriptor {
    key: string;
    variable: string;
}

export interface ContextDescriptor extends GeneralDataDescriptor {}
export interface StateDescriptor extends GeneralDataDescriptor {}

export interface ContextAware {
    saveContext?: (ctx: ContextDescriptor[]) => void;
    loadContext?: (map: any) => void;
}

export interface StateAware {
    saveState?: (ctx: StateDescriptor[]) => void;
    loadState?: (map: any) => void;
}

export function ContextVar(key?: string): (component: any, propertyKey: string) => void {
    return (component, variable) => {
        if (!component.__context__) {
            component.__context__ = [] as ContextDescriptor[];
        }
        (component.__context__ as ContextDescriptor[]).push({key: key || variable, variable});
        if (!component.saveContext) {
            Object.defineProperty(component, 'saveContext', {
                value: function(this: any, ctx: ContextDescriptor[] = component.__context__) {
                    console.log('Component instance:', this);
                    const mapContext = ctx.map(d => ({key: d.key, value: this[d.variable]}));
                    console.log('MapContext:', mapContext);
                }
            })
        }
    }
}

export function StateVar(key?: string): (component: any, propertyKey: string) => void {
    return (component, variable) => {
        if (!component.__state__) {
            component.__state__ = [] as StateDescriptor[];
        }
        (component.__state__ as StateDescriptor[]).push({key: key || variable, variable});
        if (!component.saveState) {
            Object.defineProperty(component, 'saveState', {
                value: function(this: any, stx: StateDescriptor[] = component.__state__) {
                    console.log('Component instance:', this);
                    const mapState = stx.map(d => ({key: d.key, value: this[d.variable]}));
                    console.log('MapState:', mapState);
                }
            })
        }
    }
}
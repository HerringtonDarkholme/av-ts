/**
 * The basic idea behind Component is marking on prototype
 * and then process these marks to collect options and modify class/instance.
 *
 * A decorator will mark `internalKey` on prototypes, storgin meta information
 * Then register `DecoratorProcessor` on Component, which will be called in `Component` decorator
 * `DecoratorProcessor` can execute custom logic based on meta information stored before
 *
 * For non-annotated fields, `Component` will treat them as `methods` and `computed` in `option`
 * instance variable is treated as the return value of `data()` in `option`
 *
 * So a `DecoratorProcessor` may delete fields on prototype and instance,
 * preventing meta properties like lifecycle and prop to pollute `method` and `data`
 */
import * as Vue from 'vue';
import { VClass, DecoratorProcessor, ComponentOptions, $$Prop } from './interface';
export declare function Component<T extends VClass<Vue>>(ctor: T): T;
export declare function Component(config?: ComponentOptions<Vue>): <T extends VClass<Vue>>(ctor: T) => T;
export declare namespace Component {
    function register(key: $$Prop, logic: DecoratorProcessor): void;
    let inDefinition: boolean;
}

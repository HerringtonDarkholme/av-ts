import Vue = require('vue');
export declare function Prop(target: Vue, key: string): void;
export declare type Class<T> = {
    new (...args: {}[]): T;
};
export interface PlainProp<T> {
    type?: Class<T>;
    validator?(value: T): boolean;
    required?: boolean;
}
export interface DefaultProp<T> extends PlainProp<T> {
    default: T | (() => T);
}
export interface RequiredProp<T> extends PlainProp<T> {
    required: true;
    default?: T | (() => T);
}
export interface FuncProp<T extends Function> {
    type?: FunctionConstructor;
    defaultFunc?: T;
    required?: boolean;
}
export declare function p<T>(tpe: NumberConstructor): number | undefined;
export declare function p<T>(tpe: StringConstructor): string | undefined;
export declare function p<T>(tpe: BooleanConstructor): boolean | undefined;
export declare function p<T>(tpe: Class<T>): T | undefined;
export declare function p<T>(conf: RequiredProp<T>): T;
export declare function p<T>(conf: DefaultProp<T>): T;
export declare function p<T>(conf: PlainProp<T>): T | undefined;
export declare function p<T extends Function>(conf: FuncProp<T>): T;

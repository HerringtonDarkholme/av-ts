import * as Vue from 'vue';
export declare type Dict = {
    [k: string]: any;
};
export declare function Data(target: Vue, key: 'data', _: TypedPropertyDescriptor<() => Dict>): void;

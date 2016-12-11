import Vue = require('vue');
import { VNode } from './interface';
export declare type RenderFunc = (createElement: typeof Vue.prototype.$createElement) => VNode;
export declare function Render(target: Vue, key: 'render', _: TypedPropertyDescriptor<RenderFunc>): void;

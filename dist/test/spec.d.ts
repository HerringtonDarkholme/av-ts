import { Vue } from '../index';
export declare class MyMixin extends Vue {
    k: string;
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        vuex?: {};
    }
}
export declare class MyComponent extends Vue {
    myData: string;
    funcData: () => void;
    myProp: Function | undefined;
    complex: Object;
    required: Number;
    default: number;
    screwed: (a: number) => boolean;
    myMethod(): void;
    readonly myGetter: Function | undefined;
    myWatchee: string;
    logWatch(str: string): void;
    $parent: MyMixin;
    $refs: {
        mychild: Vue;
    };
    $el: HTMLDivElement;
    beforeCreate(): void;
    created(): void;
    render(h: Function): any;
}

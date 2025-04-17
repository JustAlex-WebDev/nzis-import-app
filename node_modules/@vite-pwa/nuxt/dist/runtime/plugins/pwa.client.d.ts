import type { Plugin } from '#app';
import type { UnwrapNestedRefs } from 'vue';
import type { PwaInjection } from './types.js';
declare const plugin: Plugin<{
    pwa?: UnwrapNestedRefs<PwaInjection>;
}>;
export default plugin;

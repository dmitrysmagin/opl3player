declare module '*.js?raw' {
    const src: string;
    export default src;
}

declare module '*.css' {}

declare module '*.svelte' {
    import type { ComponentType } from 'svelte';
    const component: ComponentType;
    export default component;
}

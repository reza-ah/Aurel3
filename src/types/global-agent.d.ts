declare module 'global-agent' {
    export function bootstrap(): void;
    export const GLOBAL_AGENT_SELF_SIGNED_PROXY: string | undefined;
    export function createGlobalProxyAgent(options?: {
        environmentVariableNamespace?: string;
    }): void;
}
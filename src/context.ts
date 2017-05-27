import { Map } from './util'

export declare function Redirect(status: number, path: string, query?: any): void
export declare function Redirect(path: string, query?: any): void

export type Context = {
    isClient: boolean,
    isServer: boolean,
    isDev: boolean,
    route: any,
    store: any,
    env: Map<any>,
    params: Map<any>,
    query: Map<any>,
    req?: any,
    res?: any,
    redirect: typeof Redirect
    error: (params: {statusCode: number, message: string}) => void
}
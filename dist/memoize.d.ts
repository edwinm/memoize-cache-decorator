/**!
 @preserve memoize-decorator 2.0.0
 @copyright 2023 Edwin Martin
 @license MIT
 */
export interface Config {
    resolver?: (...args: any[]) => string | number;
    ttl?: number;
}
export declare function memoize(config?: Config): (target: object, propertyName: string, propertyDescriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function clearFunction(fn: (...args: any) => any): void;
export declare function clear(instance: object, fn: (...args: any) => any, ...args: any[]): void;

/**!
 @preserve memoize-decorator 1.1.0
 @copyright 2019 Edwin Martin
 @license MIT
 */
export interface Config {
    resolver?: (...args: any[]) => string | number;
    ttl?: number;
}
export declare function memoize(config?: Config): (target: object, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function clear(fn: () => any): void;

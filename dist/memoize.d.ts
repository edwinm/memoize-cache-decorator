/**!
 @preserve memoize-decorator 1.12.0
 @copyright 2023 Edwin Martin
 @license MIT
 */
export interface Config {
    resolver?: (...args: any[]) => string | number;
    ttl?: number;
}
export declare function memoize(config?: Config): (target: object, propertyName: string, propertyDescriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function clearFunction(fn: (...args: any) => any): void;

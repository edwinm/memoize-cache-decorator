export interface Config {
    resolver?: (...args: any[]) => string | number;
}
export declare function memoize(config?: Config): (target: object, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;

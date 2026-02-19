/**
 * utility type to for deep partial object.
 */
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

const isObject = (obj: any): obj is object =>
    obj
    && typeof obj === 'object'
    && !Array.isArray(obj)
;

/**
 * Merges multiple objects into a single target.
 * Retains type safety for the resulting intersection.
 * First object - least important
 * Last object - most important
 */
export function deepMerge<T extends object>(base: T, ...overrides: DeepPartial<T>[]): T {


    // Start with a clone of the base to avoid mutating the original
    let result = { ...base };

    for (const obj of overrides) {
        if (!obj) continue;

        Object.keys(obj).forEach((key) => {
            const k = key as keyof T;
            const bVal = result[k];
            const oVal = obj[k as keyof DeepPartial<T>];

            if (isObject(bVal) && isObject(oVal)) {
                // Recursive call
                result[k] = deepMerge(bVal as any, oVal as any);
            } else {
                // Type casting here is safe because we are overriding
                // the base structure with the partial value
                //@ts-ignore
                result[k] = oVal as T[keyof T];
            }
        });
    }

    return result as T;
}

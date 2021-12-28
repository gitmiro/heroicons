/**
 * Converts any string to camelCase.
 */
export const toCamelCase = (str: string) => {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

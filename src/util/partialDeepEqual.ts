const partialDeepEqual = (object: any, source: any): boolean =>
    Object.keys(source).every(
        key =>
            object.hasOwnProperty(key) &&
            (Array.isArray(source[key])
                ? source[key].every((v: any) => object[key].includes(v))
                : typeof source[key] === 'object' && source[key] !== null
                ? partialDeepEqual(object[key], source[key])
                : object[key] === source[key])
    ) || Object.keys(source).length === 0;

export default partialDeepEqual;

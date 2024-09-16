/**
 * A type representing a value that can be compared.
 *
 * The Comparable type can be a number, boolean, string, a function, an array of
 * Comparable, or another Comparable object. This allows for flexible data
 * structures that can be used in comparisons.
 */
export type Comparable = {
    [key: string]: number | boolean | string | Function | number[] | Comparable;
};

/**
 * A type representing a comparison function.
 *
 * The Comparator type is a function that takes two parameters of the same type
 * and returns a boolean indicating whether they are considered equal based on
 * the comparison logic.
 */
type Comparator<T> = (left: T, right: T) => boolean;

/**
 * Performs a partial deep equality check between two Comparable objects.
 *
 * This function checks if all keys in the `right` object exist in the `left`
 * object and that their values are equal according to the provided comparator.
 * It supports nested objects and arrays, allowing for a flexible comparison.
 *
 * @param left - The first Comparable object to compare.
 * @param right - The second Comparable object to compare.
 * @param comparator - A function that defines how to compare values of the
 * Comparable type.
 * @returns A boolean indicating whether the two objects are partially deeply
 * equal.
 */
const partialDeepEqual = (
    left: Comparable,
    right: Comparable,
    comparator: Comparator<Comparable[keyof Comparable]>
): boolean =>
    Object.keys(right).every((key: keyof Comparable) => {
        if (!left.hasOwnProperty(key)) {
            return false; // Key does not exist in left
        }

        const leftValue = left[key]!;
        const rightValue = right[key]!;

        // Check if both values are arrays
        if (Array.isArray(rightValue)) {
            // Compute the maximum of both arrays
            const leftMax = Math.max(...(leftValue as typeof rightValue));
            const rightMax = Math.max(...rightValue);
            // Use the comparator for the maximum values
            return comparator(leftMax, rightMax);
        }
        // Check if both values are objects
        else if (typeof rightValue === 'object' && rightValue !== null) {
            // Recursively check nested objects
            return partialDeepEqual(
                leftValue as typeof rightValue,
                rightValue,
                comparator
            );
        } else {
            // Use the comparator for primitive values
            return comparator(leftValue, rightValue);
        }
    }) || Object.keys(right).length === 0; // Allow for right to be empty

export default partialDeepEqual;

export type Comparable = {
    [key: string]:
        | number
        | boolean
        | string
        | ((...a: any) => any)
        | Comparable[]
        | Comparable;
};

type Comparator<T> = (left: T, right: T) => boolean;

const partialDeepEqual = (
    left: Comparable,
    right: Comparable,
    comparator: Comparator<Comparable[string]>
): boolean => {
    return (
        Object.keys(right).every(key => {
            if (!left.hasOwnProperty(key)) {
                return false;
            }

            const leftValue = left[key];
            const rightValue = right[key];

            if (Array.isArray(rightValue) && Array.isArray(leftValue)) {
                return rightValue.every(v => leftValue.includes(v));
            } else if (typeof rightValue === 'object' && rightValue !== null) {
                return partialDeepEqual(
                    leftValue as Comparable,
                    rightValue as Comparable,
                    comparator
                );
            } else {
                return comparator(
                    leftValue as Comparable[string],
                    rightValue as Comparable[string]
                );
            }
        }) || Object.keys(right).length === 0
    );
};

export default partialDeepEqual;

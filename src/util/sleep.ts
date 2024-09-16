/**
 * Sleeps for a given amount of milliseconds.
 *
 * @param ms {number} The amount of milliseconds to sleep for.
 * @returns {Promise<void>} A promise that resolves after the given amount of
 * milliseconds.
 */
const sleep = (ms: number) =>
    new Promise<void>(resolve => setTimeout(resolve, ms));

export default sleep;

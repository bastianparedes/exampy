const everyElementIsDifferent = <T>(array: T[]) => {
  const set = new Set();
  for (const element of array) {
      const serializedElement = JSON.stringify(element);
      if (set.has(serializedElement)) {
          return false;
      }
      set.add(serializedElement);
  }
  return true;
}

const arrayIncludesElement = <T, U>(array: T[], element: U) => {
  return array.some(item => {
    return JSON.stringify(item) === JSON.stringify(element);
  });
}

function arraysAreEqual<T extends (string | number | boolean | undefined | null)[]>(array1: T, array2: T) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function reorderArrayByIndexes<T>(array: T[], indexes: number[]): T[] {
  if (array.length !== indexes.length) {
    throw new Error('Arrays must have same length');
  }
  return indexes.map(index => array[index]);
}

function createArrayUpToNumber(number: number): number[] {
  if (number < 0 || number % 1 !== 0) {
    throw new Error('The number must be a positive integer.');
  }

  return Array.from({ length: number + 1 }, (_, index) => index);
}

export { everyElementIsDifferent, arrayIncludesElement, arraysAreEqual, shuffleArray, reorderArrayByIndexes, createArrayUpToNumber };

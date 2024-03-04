// @filename: moduleMath.ts

export const pi = 3.14;
export const phi = 1.61;

export function soustraire(a: number, b: number) {
    return a - b;
}

export function absolue(num: number) {
  if (num < 0) return num * -1;
  return num;
}
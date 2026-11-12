/**
 * Compara códigos de producto en orden natural: 104, 105, …, 110, BONO, menudencia.
 * Los códigos numéricos se ordenan por su valor y los de texto quedan al final.
 */
export const compareCodes = (a: string | number, b: string | number) =>
  String(a).localeCompare(String(b), "es", {
    numeric: true,
    sensitivity: "base",
  });

/** Devuelve una copia del arreglo ordenada por código. */
export const sortByCode = <T>(items: T[], getCode: (item: T) => string | number) =>
  [...items].sort((a, b) => compareCodes(getCode(a), getCode(b)));

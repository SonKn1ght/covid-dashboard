export function calcPer100Thousand(population: number, param: number) {
  return Math.floor((100000 * param) / population);
}

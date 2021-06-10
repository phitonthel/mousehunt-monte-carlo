// E = Weapon Type Effectiveness %
// T = Trap Power
// L = Trap Luck
// M = Mouse Power

export function CRE (E: number, T: number, L: number, M: number) {
  function min(a: number, b: number) {
    if (a > b) return b
    return a
  }
  
  const ML = Math.ceil( Math.ceil(Math.pow((M / 2), 0.5)) / min(1.4, E) )
  const CR = (E * T + 2 * Math.pow((Math.floor(min(1.4, E) * L)), 2)) / ((E * T) + M)

  if (L >= ML) return 1
  return CR
}
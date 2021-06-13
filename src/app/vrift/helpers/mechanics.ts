export class M {
  constructor() {}

  // CRE
  static CRE (E: number, T: number, L: number, M: number) {
    function min(a: number, b: number) {
      if (a > b) return b
      return a
    }
    
    const ML = Math.ceil( Math.ceil(Math.pow((M / 2), 0.5)) / min(1.4, E) )
    const CR = (E * T + 2 * Math.pow((Math.floor(min(1.4, E) * L)), 2)) / ((E * T) + M)
  
    if (L >= ML) return 1
    return CR
  }
  
  // determines which mice is attracted
  static attractsMice(micePool: any) {
    let attractedMouse = {
      "name": "FTA",
      "rangeAR": 1,
      "power": 1,
      "riftEff": 0
    }

    const rand = Math.random()
    for (let i = 0; i < micePool.length; i++) {
      const mouse = micePool[i];
      if (rand < mouse.rangeAR) {
        attractedMouse = mouse
        break
      }
    }

    return attractedMouse
  }

  // determines if FTC or not
  static catchMouse(mouseData: any, power: any, luck: any) {
    const rand = Math.random()
    const CRE = this.CRE(mouseData.riftEff, power, luck, mouseData.power)
    if (rand < CRE) return true
    return false
  }
  
  static stepsAdvancement(mouse: string, result: boolean, stats: any, mode: string) {
    let steps = 0
    if (mouse == 'FTA') {
      return 0
    }
    if (mouse == 'Terrified Adventurer' && result) {
      return (stats.speedLvl + stats.fire) *  2 * stats.stringStepping
    }
    if (result) {
      return stats.speedLvl + stats.fire
    }
    if (mouse == 'Shade of the Eclipse' && !result) {
      return 0
    }
    if (mouse == 'The Total Eclipse' && !result) {
      return 0
    }
    if (mouse == 'Bulwark of Ascent' && !result) {
      return -10
    }
    if (!result && mode == 'uu') {
      return -5
    }
    return steps
  }
  
  static nextStepsforEclipse(eclipseCount: number) {
    let steps = eclipseCount
    for (let te = 0; te < eclipseCount + 1; te++) {
      steps += (20 + (te * 10)) * 7
    }
    return steps
  }
  
  static isEclipse(playerSteps: number, stepsAdvancement: number, eclipseCount: number) {
    let steps = playerSteps + stepsAdvancement
    if (steps >= this.nextStepsforEclipse(eclipseCount)) {
      return true
    } else {
      return false
    }
  }
  
  // handle the players to challenge the Eclipse first
  static stepsPlacement(playerSteps: number, stepsAdvancement: number, eclipseCount: number) {
    let steps = playerSteps + stepsAdvancement
    if (steps >= this.nextStepsforEclipse(eclipseCount)) {
      return this.nextStepsforEclipse(eclipseCount)
    } else {
      return steps
    }
  }
  
  static floorsToSteps(floors: number) {
    let eclipseCount = 0
    let steps = 0
    for (let floor = 2; floor <= floors; floor++) {
      if ((floor-1) % 8 == 0) {
        eclipseCount ++
        steps += 1
      } else {
        steps += 20 + (eclipseCount * 10)
      }
    }
    return steps
  }
  
  static stepsToFloors(steps: number) {
    let eclipseCount = 0
    let floors = 1
    for (let i = 0; i < Infinity; i++) {
  
      if (floors % 8 == 0) {
        steps -= 1
        if (steps < 0) break
        eclipseCount++
        floors ++
      }
  
      const reqStepsToAdvance = 20 + (eclipseCount * 10)
      steps -= reqStepsToAdvance
      if (steps < 0) break
      floors ++
    }
    return floors
  }

  static isFallingDown(currentSteps: number, advancement: number) {
    const currentFloor = this.stepsToFloors(currentSteps)
    const nextFloor = this.stepsToFloors(currentSteps + advancement)
  
    if (nextFloor < currentFloor) {
      return true
    }
    return false
  }
}
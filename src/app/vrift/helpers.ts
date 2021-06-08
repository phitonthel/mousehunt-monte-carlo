export class H {
  constructor() {}

  static generatePlayers(nPlayers: number, playerSetting: object) {
    const players = []
    for (let i = 0; i < nPlayers; i++) {
      players.push(playerSetting)
    }
    return players
  }
  
  static attrTA(floors: number) {
    if (floors <= 7) return 0.1833
    if (floors <= 15) return 0.1115
    if (floors <= 23) return 0.1015
    return 0.0832
  }
  
  static attrBulwark(floors: number) {
    if (floors <= 7) return 0.1797
    if (floors <= 15) return 0.1866
    if (floors <= 23) return 0.1963
    return 0.1999
  }
  
  static miceAttracted(floors: number) {
    const rand = Math.random()
    if (rand < this.attrTA(floors)) return 'ta'
    if (rand < (this.attrTA(floors) + this.attrBulwark(floors))) return 'bulwark'
    return 'normal'
  }
  
  static isCaught(mouse: string, cre: any) {
    const rand = Math.random()
    if (rand < cre[mouse]) return true
    return false
  }
  
  static stepsAdvancement(mouse: string, isCaught: boolean, stats: any) {
    let steps = 0
    if (mouse == 'ta' && isCaught) {
      steps = (stats.speedLvl + stats.fire) *  2 * stats.stringStepping
      return steps
    }
    if (isCaught) {
      steps = stats.speedLvl + stats.fire
      return steps
    }
    if (mouse == 'eclipse' && !isCaught) {
      steps = 0
      return steps
    }
    if (mouse == 'bulwark' && !isCaught) {
      steps = -10
      return steps
    }
    if (!isCaught) {
      steps = -5
      return steps
    }
    return steps
  }
  
  static nextStepsforTE(eclipseCount: number) {
    let steps = 0
    for (let te = 0; te < eclipseCount + 1; te++) {
      steps += (20 + (te * 10) + te) * 7
    }
    return steps
  }
  
  static isTE(playerSteps: number, stepsAdvancement: number, eclipseCount: number) {
    let steps = playerSteps + stepsAdvancement
    if (steps >= this.nextStepsforTE(eclipseCount)) {
      return true
    } else {
      return false
    }
  }
  
  static stepsPlacement(playerSteps: number, stepsAdvancement: number, eclipseCount: number) {
    let steps = playerSteps + stepsAdvancement
    if (steps >= this.nextStepsforTE(eclipseCount)) {
      return this.nextStepsforTE(eclipseCount)
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
        steps -= eclipseCount
        if (steps <= 0) break
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
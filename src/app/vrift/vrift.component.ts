import { Component, OnInit } from '@angular/core';
import { H } from './helpers/helpers'
import { M } from './helpers/mechanics'

// import data
import vriftData from './data/vrift-mouse-pool-all'

@Component({
  selector: 'app-vrift',
  templateUrl: './vrift.component.html',
  styleUrls: ['./vrift.component.css']
})
export class VriftComponent implements OnInit {
  messages: any[] = []
  nPlayers: number = 1
  actionType: string = 'floor'
  data: any = vriftData


  debug: boolean = false
  debugMessages: string[] = []

  floorsData: any[] = []
  eclipseData: any[] = []
  stepsData: any[] = []
  detailedData: any[] = []
  playersData: any[] = []

  stats = {
    speedLvl: 10,
    syncLvl: 5,
    siphonLvl: 5,
    fire: 0, // yes=1, no=0
    stringStepping: 1, // yes=2, no=1
    superSiphon: 1, // yes=2, no=1
  }

  playerSetting = {
    stamina: 100,
    steps: 0,
    power: 60000,
    luck: 70,
    ultimateCharm: false,
    floors: 1,
    eclipseCount: 0,
    eclipsePhase: false
  }

  cre = {
    normal: 0.8,
    ta: 1,
    bulwark: 0.55,
    eclipse: 0.5
  }

  settings = {
    fire: false,
    stringStepping: false,
    superSiphon: false,
    uu: true
  }

  // show/disable
  enableCRE = false

  constructor() { }

  ngOnInit(): void {
  }

  run(): void {
    this.messages = ['Loading...']

    // assign new value to player's floor, eclipseCount, eclipsePhase based on steps
    this.playerSetting.floors = M.stepsToFloors(this.playerSetting.steps)
    this.playerSetting.eclipseCount = Math.floor(this.playerSetting.floors / 8)

    console.log(this.playerSetting);
    console.log(this.stats);
    console.log(this.cre);
    setTimeout(() => {
      this.monteCarlo()
    }, 100)
  }

  monteCarloDev() {
    this.messages = [JSON.stringify(this.stats, null, 2)]
    this.messages.push(JSON.stringify(this.settings, null, 2))
  }

  simulation() {
    const player = JSON.parse(JSON.stringify(this.playerSetting))
    const players = []
    // hunt until run out of stamina
    for (let hunt = 0; hunt < Infinity; hunt++) {
      if (player.stamina <= 0) break
      player.stamina = player.stamina - 1

      // new algoritms
      let mode = 'uu'

      // if TE 13+, use micePool 105-112
      let micePool = []
      if (player.floors < 104) {
        micePool = this.data[mode][`floor${player.floors}`].mice
      } else if (player.floors % 8 == 0) {
        micePool = this.data[mode][`floor8`].mice
      } else {
        const f = 104 + (player.floors % 8)
        micePool = this.data[mode][`floor${f}`].mice
      }

      // determine which mice is attracted, return an object (name, power, etc)
      const miceAttracted = M.attractsMice(micePool)

      // determines if FTC or not
      let result = M.catchMouse(miceAttracted, player.power, player.luck)
      if (miceAttracted.name == 'Shade of the Eclipse' || miceAttracted.name == 'The Total Eclipse') {
        if (player.ultimateCharm) {
          result = true
        }
      }

      // eclipse count++, siphon
      if (miceAttracted.name == 'Shade of the Eclipse' || miceAttracted.name == 'The Total Eclipse') {
        if (result) {
          player.eclipseCount++
          player.stamina += this.stats.siphonLvl * 5 * this.stats.superSiphon
        }
      }

      // determines the advancement
      const advancement = M.stepsAdvancement(miceAttracted.name, result, this.stats)
      // determines steps placement, can't past the Eclipse unless caught
      const placement = M.stepsPlacement(player.steps, advancement, player.eclipseCount)

      // check whether the advancement can set the player back to previous floor
      const isFallDown = M.isFallingDown(player.steps, advancement)

      // set new value to player
      isFallDown
        ? player.steps = M.floorsToSteps(player.floors)
        : player.steps = placement
      player.floors = M.stepsToFloors(player.steps)

      // console.log(miceAttracted.name, result, player.steps, player.floors, advancement, player.stamina);

      if (this.nPlayers == 1) {
        let res
        result 
          ? res = 'CAUGHT'
          : res = 'MISSED'
        let message = { res, advancement,
          TE: player.eclipseCount,
          hunt: hunt+1,
          stamina: player.stamina,
          mouse: miceAttracted.name, 
          floors: player.floors, 
          steps: player.steps }
        this.detailedData.push(message)
      }
    }
    return player
  }

  monteCarlo() {
    const players = []

    // simulate each player
    for (let i = 0; i < this.nPlayers; i++) {
      const player = (this.simulation())

      // extract the necessary data
      players.push({
        steps: player.steps,
        floors: player.floors,
        eclipseCount: player.eclipseCount
      })
    }

    // count data
    this.floorsData = []
    for (let i = 0; i < 200; i++) {
      const count = players.filter(player => player.floors === i).length;
      if (count > 0) {
        this.floorsData.push(`Floors ${i}: ${count} players (${((count / players.length) * 100).toFixed(2)}%)`)
      }
    }

    this.eclipseData = []
    for (let i = 0; i < 25; i++) {
      const count = players.filter(player => player.eclipseCount === i).length;
      if (count > 0) {
        this.eclipseData.push(`TE ${i}: ${count} players (${((count / players.length) * 100).toFixed(2)}%)`)
      }
    }

    // save players data
    this.playersData = players

    // show in Journals
    this.nPlayers == 1
      ? this.messages = this.detailedData
      : this.messages = this.floorsData

  }

  fire(value: number) { this.stats.fire = value }
  stringStepping(value: number) { this.stats.stringStepping = value }
  superSiphon(value: number) { this.stats.superSiphon = value }

  seeStepsData() {
    this.stepsData = []
    for (let i = 0; i < 10000; i++) {
      const count = this.playersData.filter(player => player.steps === i).length;
      if (count > 0) {
        this.stepsData.push(`Steps ${i + 1}: ${count} players (${((count / this.playersData.length) * 100).toFixed(2)}%)`)
      }
    }
    this.messages = this.stepsData
  }
  seeFloorData() { this.messages = this.floorsData }
  seeEclipseData() { this.messages = this.eclipseData }
  showCRE() { this.enableCRE = true }
  hideCRE() { this.enableCRE = false }

}

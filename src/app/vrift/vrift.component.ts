import { Component, OnInit } from '@angular/core';
import { M } from './helpers/mechanics'
import Swal from 'sweetalert2'

// import data
import vriftData from './data/vrift-mouse-pool-all'

@Component({
  selector: 'app-vrift',
  templateUrl: './vrift.component.html',
  styleUrls: ['./vrift.component.css'],
})
export class VriftComponent implements OnInit {
  messages: any[] = []
  nPlayers: number = 100
  actionType: string = 'floor'
  data: any = vriftData

  speedLvlOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  siphonLvlOptions: number[] = [1, 2, 3, 4, 5]

  debug: boolean = false
  debugMessages: string[] = []

  floorsData: any[] = []
  eclipseData: any[] = []
  stepsData: any[] = []
  detailedData: any[] = []
  playersData: any[] = []
  taData: number = 0

  isDetailed: boolean = false

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
    power: 13111,
    luck: 35,
    floors: 1,
    eclipseCount: 0,
  }

  settings = {
    fire: true,
    stringStepping: true,
    superSiphon: true,
    mode: true, //true = UU, false == normal
    ultimateCharm: false, //UC on Eclipse
  }

  constructor() { }

  ngOnInit(): void {
    this.initSetup()
  }

  run(): void {
    this.messages = ['Loading...']
    this.isDetailed = false
    this.detailedData = []
    this.floorsData = []
    this.eclipseData = []

    // assign new value to player's floor, eclipseCount, based on steps
    this.playerSetting.floors = M.stepsToFloors(this.playerSetting.steps)
    this.playerSetting.eclipseCount = Math.floor(this.playerSetting.floors / 8)

    // manually convert string to number because JS sucks
    this.stats.speedLvl = Number(this.stats.speedLvl)
    this.stats.siphonLvl = Number(this.stats.siphonLvl)
    this.nPlayers = Number(this.nPlayers)
    this.playerSetting.stamina = Number(this.playerSetting.stamina)
    this.playerSetting.steps = Number(this.playerSetting.steps)

    // convert the settings
    this.settings.fire ? this.stats.fire = 1 : this.stats.fire = 0
    this.settings.stringStepping ? this.stats.stringStepping = 2 : this.stats.stringStepping = 1
    this.settings.superSiphon ? this.stats.superSiphon = 2 : this.stats.stringStepping = 1

    console.log(this.playerSetting);
    console.log(this.settings);
    // console.log(this.stats);

    // validation
    if (isNaN(this.nPlayers) || isNaN(this.playerSetting.stamina) || isNaN(this.playerSetting.steps)) {
      Swal.fire({
        icon: 'error',
        text: 'Invalid input!',
      })
      this.messages = ['Error!']
      this.isDetailed = false
      return
    }

    if (!Number.isInteger(this.nPlayers) || !Number.isInteger(this.playerSetting.stamina) || !Number.isInteger(this.playerSetting.steps)) {
      Swal.fire({
        icon: 'error',
        text: 'Integer only!',
      })
      this.messages = ['Error!']
      this.isDetailed = false
      return
    }

    // run
    setTimeout(() => {
      this.monteCarlo()
    }, 100)
  }

  runDev() {
    this.messages = [JSON.stringify(this.stats, null, 2)]
    this.messages.push(JSON.stringify(this.settings, null, 2))
  }

  simulation(iteration: number) {
    const player = JSON.parse(JSON.stringify(this.playerSetting))
    const players = []
    const mode = this.settings.mode ? 'uu' : 'normal'

    // hunt until run out of stamina
    for (let hunt = 0; hunt < 100000; hunt++) {
      if (player.stamina <= 0) break
      player.stamina = player.stamina - 1

      // if TE 13+, use micePool 105-112
      let micePool = []
      if (mode == 'uu') {
        if (player.floors < 104) {
          micePool = this.data[mode][`floor${player.floors}`].mice
        } else if (player.floors % 8 == 0) {
          micePool = this.data[mode][`floor8`].mice
        } else {
          const f = 104 + (player.floors % 8)
          micePool = this.data[mode][`floor${f}`].mice
        }
      }

      // if SotE 10+, use micePool 81-88
      if (mode == 'normal') {
        if (player.floors < 80) {
          micePool = this.data[mode][`floor${player.floors}`].mice
        } else if (player.floors % 8 == 0) {
          micePool = this.data[mode][`floor8`].mice
        } else {
          const f = 80 + (player.floors % 8)
          micePool = this.data[mode][`floor${f}`].mice
        }
      }

      // determine which mice is attracted, return an object (name, power, etc)
      const miceAttracted = M.attractsMice(micePool)

      // determines if FTC or not
      let result = M.catchMouse(miceAttracted, player.power, player.luck)
      if (miceAttracted.name == 'Shade of the Eclipse' || miceAttracted.name == 'The Total Eclipse') {
        if (this.settings.ultimateCharm) {
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
      const advancement = M.stepsAdvancement(miceAttracted.name, result, this.stats, mode)
      // determines steps placement, can't past the Eclipse unless caught
      const placement = M.stepsPlacement(player.steps, advancement, player.eclipseCount)
      // check whether the advancement can set the player back to previous floor
      const isFallDown = M.isFallingDown(player.steps, advancement)

      // set new value to player
      isFallDown
        ? player.steps = M.floorsToSteps(player.floors)
        : player.steps = placement < 0 ? 0 : placement
      player.floors = M.stepsToFloors(player.steps)

      // console.log(miceAttracted.name, result, player.steps, player.floors, advancement, player.stamina);

      // add to detailed journal for the first player
      if (iteration == 0) {
        let message = {
          advancement, result,
          eclipse: player.eclipseCount,
          hunt: hunt + 1,
          stamina: player.stamina,
          mouse: miceAttracted.name,
          floors: player.floors,
          steps: player.steps
        }
        this.detailedData.push(message)
      }
    }
    return player
  }

  monteCarlo() {
    const players = []

    // simulate each player
    for (let iteration = 0; iteration < this.nPlayers; iteration++) {
      const player = this.simulation(iteration)

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

    this.taData = 0
    this.taData = this.detailedData.filter(journal => journal.mouse == 'Terrified Adventurer').length;

    // save players data
    // this.playersData = players

    // show in Journals
    this.messages = this.detailedData
    this.isDetailed = true

  }

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

  initSetup() {
    const storage = localStorage.getItem('setup')
    if (storage) {
      const data = JSON.parse(storage)
      this.nPlayers = data.nPlayers,
      this.stats = data.stats,
      this.playerSetting = data.playerSetting,
      this.settings = data.settings
    }
  }

  saveSetup() {
    const data = {
      nPlayers: this.nPlayers,
      stats: this.stats,
      playerSetting: this.playerSetting,
      settings: this.settings
    }
    localStorage.setItem('setup', JSON.stringify(data, null, 2));
    Swal.fire({
      icon: 'success',
      text: 'Everytime you visit this page, you will automatically use your saved setup!',
    })
    
  }

  deleteSetup() {
    localStorage.clear()
    Swal.fire({
      icon: 'success',
      text: 'Deleted!',
    })
  }

  seeDetailedData() { this.messages = this.detailedData, this.isDetailed = true }
  seeFloorData() { this.messages = this.floorsData, this.isDetailed = false }
  seeEclipseData() { this.messages = this.eclipseData, this.isDetailed = false }

  // fire(value: number) { this.stats.fire = value }
  // stringStepping(value: number) { this.stats.stringStepping = value }
  // superSiphon(value: number) { this.stats.superSiphon = value }
  // showCRE() { this.enableCRE = true }
  // hideCRE() { this.enableCRE = false }

}

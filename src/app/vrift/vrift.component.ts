import { Component, OnInit } from '@angular/core';
import { H } from './helpers'

@Component({
  selector: 'app-vrift',
  templateUrl: './vrift.component.html',
  styleUrls: ['./vrift.component.css']
})
export class VriftComponent implements OnInit {
  messages: any[] = []
  nPlayers: number = 1000
  actionType: string = 'floor'

  floorsData: any[] = []
  eclipseData: any[] = []
  stepsData: any[] = []
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

  loading(): void {
    this.messages = ['Loading...']

    // assign new value to player's floor, eclipseCount, eclipsePhase based on steps
    this.playerSetting.floors = H.stepsToFloors(this.playerSetting.steps)
    this.playerSetting.eclipseCount = Math.floor(this.playerSetting.floors/8)

    setTimeout(() => {
      this.monteCarlo()
    }, 100)
  }

  monteCarloDev() {
    this.messages = [JSON.stringify(this.stats, null, 2)]
    this.messages.push(JSON.stringify(this.settings, null, 2))
  }

  monteCarlo() {
    const players = []
  
    // simulate each player
    for (let i = 0; i < this.nPlayers; i++) {
      const player = JSON.parse(JSON.stringify(this.playerSetting))
  
      // hunt until run out of stamina
      for (let hunt = 0; hunt < Infinity; hunt++) {
        if (player.stamina <= 0) break
        player.stamina = player.stamina - 1
  
        // if TE phase
        if (player.eclipsePhase) {
          const caught = H.isCaught('eclipse', this.cre)
          if (caught) {
            player.steps += H.stepsAdvancement('eclipse', caught, this.stats)
            player.stamina += this.stats.siphonLvl * 5 * this.stats.superSiphon
            player.eclipsePhase = false
            player.eclipseCount ++
            player.floors++
          }
          continue
        }
  
        // if not TE phase
        const attractedMouse = H.miceAttracted(player.floors) // which mice is attracted
        const result = H.isCaught(attractedMouse, this.cre) // FTC or not (booleean)
        const advancement = H.stepsAdvancement(attractedMouse, result, this.stats) // how many steps is increase or decrease
  
        // check whether the advancement can set the player back to previous floor
        const isFallDown = H.isFallingDown(player.steps, advancement)
  
        // set new value to player
        player.eclipsePhase = H.isTE(player.steps, advancement, player.eclipseCount)
        isFallDown
          ? player.steps = H.floorsToSteps(player.floors)
          : player.steps = H.stepsPlacement(player.steps, advancement, player.eclipseCount)
        player.floors = H.stepsToFloors(player.steps)
      }
  
      // extract the necessary data
      players.push({
        steps: player.steps,
        floors: player.floors,
        eclipseCount: player.eclipseCount
      })
    }

    // filter the data
    // this.floorsData = players.filter(function (player) {
    //   return player.steps <= 1000
    // });

    // count data
    this.floorsData = []
    for (let i = 0; i < 200; i++) {
      const count = players.filter(player => player.floors === i+1).length;
      if (count > 0) {
        this.floorsData.push(`Floors ${i+1}: ${count} players (${((count/players.length)*100).toFixed(2)}%)`)
      }
    }

    this.eclipseData = []
    for (let i = 0; i < 20; i++) {
      const count = players.filter(player => player.eclipseCount === i).length;
      if (count > 0) {
        this.eclipseData.push(`TE ${i+1}: ${count} players (${((count/players.length)*100).toFixed(2)}%)`)
      }
    }

    // saved players data
    this.playersData = players

    // show in Journals
    this.messages = this.floorsData
    
  }

  fire(value: number) { this.stats.fire = value }
  stringStepping(value: number) { this.stats.stringStepping = value }
  superSiphon(value: number) { this.stats.superSiphon = value }

  seeStepsData() {
    this.stepsData = []
    for (let i = 0; i < 10000; i++) {
      const count = this.playersData.filter(player => player.steps === i).length;
      if (count > 0) {
        this.stepsData.push(`Steps ${i+1}: ${count} players (${((count/this.playersData.length)*100).toFixed(2)}%)`)
      }
    }
    this.messages = this.stepsData
  }
  seeFloorData() { this.messages = this.floorsData }
  seeEclipseData() { this.messages = this.eclipseData }
  showCRE() { this.enableCRE = true }
  hideCRE() { this.enableCRE = false }

}

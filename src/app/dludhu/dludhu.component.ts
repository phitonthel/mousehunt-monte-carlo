import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dludhu',
  templateUrl: './dludhu.component.html',
  styleUrls: ['./dludhu.component.css']
})
export class DludhuComponent implements OnInit {
  messages: any[] = []

  iteration: number = 100000
  nTry: number = 100
  chanceToTrigger: number = 0.15

  nSucceed: number = 0
  nFailed: number = 0

  constructor() { }

  ngOnInit(): void {
  }

  showHelp() {
    Swal.fire({
      html: 'Ever got a 6 FTAs with Gouda in 9 hunts and wanted to know how DHU you are? <br><br>Fill the input of <b>Number of Tries Each Player</b> with <b>9</b>, and <b>Chance to Trigger per Try</b> with <b>0.15</b> (since the probability of FTA with Gouda is 15%), and run the simulation.<br><br>You will see your chances of happening by looking at the result.'
    })
  }

  loading(): void {
    this.messages = ['Loading...']
    setTimeout(() => {
      this.monteCarlo()
    }, 100)
  }

  monteCarlo() {
    let arrNumOfSuccess = []
    let arrSuccessBool = []
    let output = []

    for (let i = 0; i < this.iteration; i++) {

      let person: any = [false, 0]

      for (let j = 0; j < this.nTry; j++) {
        let r = Math.random()
        if (r < this.chanceToTrigger) {
          person[0] = true
          person[1] += 1
        }
      }
      arrSuccessBool.push(person[0])
      arrNumOfSuccess.push(person[1])
    }

    let sortedArrSuccessBool = arrSuccessBool.sort()
    let sortedArrNumOfSuccess = arrNumOfSuccess.sort()

    this.nSucceed = sortedArrSuccessBool.filter(x => x === true).length
    this.nFailed = sortedArrSuccessBool.filter(x => x === false).length

    let isAngkaAwalUdahMuncul = false
    for (let i = 1; i < 100; i++) {
      let countNumOfSuccess = sortedArrNumOfSuccess.filter(x => x === i).length
      if (countNumOfSuccess != 0) {
        isAngkaAwalUdahMuncul = true
        output.push(`Triggered ${i} time(s): ${countNumOfSuccess} players, or ${countNumOfSuccess * 100 / this.iteration}%`)
      }
      if (countNumOfSuccess == 0 && isAngkaAwalUdahMuncul == true) { break }
    }
    this.messages = output
  }
}

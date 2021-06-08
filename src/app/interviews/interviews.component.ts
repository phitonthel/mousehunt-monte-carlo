import { Component, OnInit } from '@angular/core';
import axios from 'axios'

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent implements OnInit {
  nInterviews: number = 1
  nParticipant: number = 0
  percentage: number = 0
  messages: string[] = []
  monteSuccess: number = 0
  monteOptions: boolean = false
  monteOptionsCount: number = 0

  constructor() { }

  ngOnInit(): void {
    // axios({
    //   method: 'POST',
    //   url: 'https://phitonthel-server-sandbox.herokuapp.com/database',
    //   data: {
    //     name: 'visitorProd'
    //   }
    // })
    //   .then(() => {})
    //   .catch(() => {})
  }

  enableMonteCarlo(): void {
    this.monteOptions = true
    this.monteOptionsCount = -Infinity
  }

  monteWithLoading(): void {
    this.messages = ['Loading...']
    setTimeout(() => {
      this.interviewsMonte()
    }, 100)
  }

  interviewsMonte(): void {
    console.log('loading');
    
    this.monteSuccess = 0

    for (let i = 0; i < this.nInterviews; i++) {
      this.interviewsBulk(true)
    }
    const output = []
    output.push(`You did ${this.nInterviews} batch of interviews`, `Each batch of interview consist of ${this.nParticipant} applicants`, `Every interview, you interviewed ${Math.floor(this.nParticipant * (this.percentage / 100))} applicants to get the baseline score, rejected the first ${Math.floor(this.nParticipant * (this.percentage / 100))} and interviewed the rest ${this.nParticipant - (Math.floor(this.nParticipant * (this.percentage / 100)))}`, `You successfully hired the best applicants ${this.monteSuccess} out of ${this.nInterviews} interviews`, `Your accuracy is ${(this.monteSuccess / this.nInterviews) * 100}%`)
    this.messages = output
  }

  interviews(monte: boolean): void {
    console.log('interviews () running')
    this.monteOptionsCount++
    
    const nApplicants = this.nParticipant
    const perc = this.percentage / 100

    const output = []
    const nApplicantsBaseline = Math.floor(nApplicants * perc)
    const nextApplicants = nApplicants - nApplicantsBaseline

    // generate applicants
    const applicants = []
    const constant = Math.random() * 1000
    const baseMultiplier = Math.random() * 1000
    for (let i = 0; i < nApplicants; i++) {
      applicants.push([i + 1, (Math.random() * baseMultiplier) + constant])
    }

    // sorted applicants
    const sortedApplicants = [...applicants].sort(function (a, b) { return b[1] - a[1] })

    // interviews some of them to get the average/baseline score
    let applicantBaseline = [0, 0]
    for (let i = 0; i < nApplicantsBaseline; i++) {
      const applicant = applicants[i]
      if (applicant[1] > applicantBaseline[1]) {
        applicantBaseline = [applicant[0], applicant[1]]
      }
    }

    if (!monte) {
      output.push(`You interviewed ${nApplicantsBaseline} applicants and the best applicant is no:${applicantBaseline[0]} with a score:${applicantBaseline[1]}. You set the score of this applicant for your baseline`)

      output.push(`You continue to interview the rest of ${nextApplicants} applicants, searching if there is someone with a score higher than your baseline`)
    }

    let hiredApplicant:any = []
    for (let i = nApplicantsBaseline; i < applicants.length; i++) {
      const applicant = applicants[i]
      if (applicant[1] > applicantBaseline[1]) {
        hiredApplicant = applicant
        break
      }
    }

    if (!monte) {
      if (hiredApplicant.length !== 0) {
        output.push(`After a while, you found an applicant with a higher score than no:${applicantBaseline[0]}. His name is no:${hiredApplicant[0]} with a score of ${hiredApplicant[1]}`, 'You hired him.')
        if (hiredApplicant[0] === sortedApplicants[0][0]) {
          output.push(`Success! Your hired applicant is the best applicant from ${applicants.length} applicants that applied`)
        } else {
          output.push(`Unfortunately, the best applicant is yet to come. He is applicant no:${sortedApplicants[0][0]} with a score of ${sortedApplicants[0][1]}`)
          output.push('You failed to hire the best applicant')
          output.push('You had only one job!')
        }
      } else {
        output.push(`Unfortunately, you found no one with a higher score than before. Your best applicant is what you interviewed earlier, applicant no:${applicantBaseline[0]} with a score of ${applicantBaseline[1]}.`, 'You had only one job!')
      }
    } else if (monte) {
      if (hiredApplicant.length !== 0) {
        if (hiredApplicant[0] === sortedApplicants[0][0]) {
          this.monteSuccess++
        }
      }
    }

    if (!monte) this.messages = output
  }

  interviewsBulk(monte: boolean): void {
    this.monteOptionsCount++
    
    const nApplicants = this.nParticipant
    const perc = this.percentage / 100

    const output = []
    const nApplicantsBaseline = Math.floor(nApplicants * perc)
    const nextApplicants = nApplicants - nApplicantsBaseline

    // generate applicants
    const applicants = []
    const constant = Math.random() * 1000
    const baseMultiplier = Math.random() * 1000
    for (let i = 0; i < nApplicants; i++) {
      applicants.push([i + 1, (Math.random() * baseMultiplier) + constant])
    }

    // sorted applicants
    const sortedApplicants = [...applicants].sort(function (a, b) { return b[1] - a[1] })

    // interviews some of them to get the average/baseline score
    let applicantBaseline = [0, 0]
    for (let i = 0; i < nApplicantsBaseline; i++) {
      const applicant = applicants[i]
      if (applicant[1] > applicantBaseline[1]) {
        applicantBaseline = [applicant[0], applicant[1]]
      }
    }

    let hiredApplicant:any = []
    for (let i = nApplicantsBaseline; i < applicants.length; i++) {
      const applicant = applicants[i]
      if (applicant[1] > applicantBaseline[1]) {
        hiredApplicant = applicant
        break
      }
    }

    if (monte) {
      if (hiredApplicant.length !== 0) {
        if (hiredApplicant[0] === sortedApplicants[0][0]) {
          this.monteSuccess++
        }
      }
    }
  }

}

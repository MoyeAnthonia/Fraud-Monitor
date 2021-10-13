import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment2 from 'moment-timezone';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import pageservice from 'app/_services/page.service';
import { DashboardService } from 'app/_services/dashboard.service';
import formatService from 'app/_services/format.service';
import eventsService from '../../_services/events.service';
import { AgentService } from '../../_services/agent-profile.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  headers: any[] = [ "Wallet ID", "Value", "Transaction Date"]

  ordered_data: any[] = [ 'wallet', "amount", "txn_date"]
  loading = true;

  datas: any[] = []
  raw_data: any[] = []
  status: any = {}

  months: any[] = ['JAN', 'FEB', 'MAR', 'APRIL', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  years: any[] = []

  loaders: any[] = []

  details: any = {}

  serial: number = 0
  limit: number = 5
  skip: number = 0
  total: number = 0
  end: number = 0
  search: string = ''
  searchValue: string = ''

  date = moment2(new Date()).tz('Africa/Lagos').year()

  subscription: any [] = []

  constructor(private router: Router, private dashboardService: DashboardService, private agentService: AgentService) { }

  ngOnInit() {
    let sub
    sub = eventsService.getEvent('error').subscribe(url => {
      if(url.includes('agents/category/count')){
        this.setLoader(1, 'failed')
      }
      if(url.includes('transaction/flagged')){
        this.setLoader(0, 'failed')
      }
      if(url.includes('vas/activity')){
        this.setLoader(2, 'failed')
        let data1: any[] = [];
        let data2: any[] = [];

        this.chartDatasets = [
          {data: data2, label: 'Inactive'},
          {data: data1, label: 'Active'}
        ]
      }
    })

    this.subscription.push(sub)

     sub = eventsService.getEvent('Agent-Filter').subscribe(status => {

      if (status == "next") {

        this.skip += this.limit
        this.getSuspectedWallet();

      } else if (status == "previous") {

        this.skip -= this.limit

        if (this.skip < 0) {
          this.skip = 0
        }

        this.getSuspectedWallet();
      }

    })

    this.subscription.push(sub)

    // setting year dropdown
    for (let i = this.date; i > (this.date - 10); i--) {
      this.years.push(i)
    }

    this.loaders = [undefined, undefined, undefined]

    this.getSuspectedWallet()
    this.getStatus()
    this.getChart(this.date)

  }

  searchWallet(event){

    if(event.key == "Enter"){
      this.total = 0
      this.serial = 0
      this.skip = 0
      this.end = 0
      
      this.search = event.target.value
      this.getSuspectedWallet()
    }
  }

  ngOnDestroy(){
    if(this.subscription){
      for (let i = 0; i < this.subscription.length; i++) {
        this.subscription[i].unsubscribe()
      }
    }
  }

  public chartType: string = 'line';

  public chartDatasets: Array<any> = [];

  public chartLabels: Array<any> = this.months

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(200, 99, 132, 1)',
    },
    {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 213, 132, .7)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(0, 213, 132, 1)',

    },
  ];

  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontColor: '#5b5f62',
          beginAtZero: true,
          callback: function (value, index, values) {
            

            if (value > 1) {

              value = value.toLocaleString();
            }
            return value;
          }
        }
      }]
    },
    tooltips: {
      callbacks: {
          label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                  label += ': ';
              }
              label += tooltipItem.yLabel.toLocaleString();
              return label;
          }
      }
  },

  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

// used to for spinner and data display
// @param index used to determine what loader status to change
// @param status can be default, successful and failed
// default shows spinners, successful shows data, failed for when there is no data available
  setLoader(index, status){

    if(status == 'default'){
      this.loaders[index] = undefined

    }
    else if(status == 'successful'){
      this.loaders[index] = true
    }else{
      this.loaders[index] = false
    }
  }

 // gets a list of suspected wallets
  getSuspectedWallet() {
    this.setLoader(0, 'default')
    this.datas = []

    let sub =
    this.dashboardService.getSuspected(this.limit, this.skip, this.search).subscribe(data => {
      if(data.results.length){
        this.total = data.count

        this.serial = 1 + (this.skip / this.limit) * this.limit;
        this.end = (this.serial + data.results.length) - 1

        for(let i = 0; i < data.results.length; i++){
          this.datas.push({wallet: data.results[i].transaction.wallet, amount: '₦' + formatService.formatCurrency((data.results[i].transaction.amount).toString()), txn_date: formatDate(data.results[i].transaction.metadata.pfm.journal.timestamp, 'yyyy-MM-dd hh:mm:ss', 'en')})
        }

        this.setLoader(0, 'successful')
      }else{
        this.setLoader(0, 'failed')
      }
    })

    this.subscription.push(sub)

  }

  getAgentName(wallet){
    let sub =
    this.agentService.getAgent(wallet).subscribe(data => {
      if (data) {
       this.details.name = data.name
      
      }
    })
    this.subscription.push(sub)
  }

  setDetails(row){
    this.details = row;
    this.getAgentName(row.wallet)
  }

  // gets counts of types of wallet
  getStatus() {
    this.loading = true;

    this.status = {}
    this.setLoader(1, 'default')
    let sub =
    this.dashboardService.getStatus().subscribe(data => {
      if(data){
        this.loading = false;

        this.status = data
        this.status.active_count = formatService.formatNumber(this.status.active_count.toString())
        this.status.total_count = formatService.formatNumber(this.status.total_count.toString())
        this.status.invalid_count = formatService.formatNumber(this.status.invalid_count.toString())
        this.status.inactive_count = formatService.formatNumber(this.status.inactive_count.toString())
        this.status.not_in_use_count = formatService.formatNumber(this.status.not_in_use_count.toString())
     
        this.status.active_value = formatService.formatNumber(this.status.active_value.toString())
        this.status.active_volume = formatService.formatNumber(this.status.active_volume.toString())

        this.status.inactive_value = formatService.formatNumber(this.status.inactive_value.toString())
        this.status.inactive_volume = formatService.formatNumber(this.status.inactive_volume.toString())

        this.status.invalid_value = formatService.formatNumber(this.status.invalid_value.toString())
        this.status.invalid_volume = formatService.formatNumber(this.status.invalid_volume.toString())

        this.status.not_in_use_volume = formatService.formatNumber(this.status.not_in_use_volume.toString())
        this.status.not_in_use_value = formatService.formatNumber(this.status.not_in_use_value.toString())
        
        this.status.total_value = formatService.formatNumber(this.status.total_value.toString())
        this.status.total_volume = formatService.formatNumber(this.status.total_volume.toString())

        this.setLoader(1, 'successful')
      }
    })

    this.subscription.push(sub)

  }

  // plots inactive and active wallets against months in a year
  //  @param year used to query different years
  getChart(year?) {
    this.chartDatasets = []
    this.setLoader(2, 'default')
    let datas = []
    let sub =
    this.dashboardService.getChart(year).subscribe(data => {
      if(data){
        datas = data.results

        let data1: any[] = [];
        let data2: any[] = [];

        for(let i = 1; i <= 12; i++){
          data1.push(0)
          data2.push(0)
          
          for(let j = 0; j < datas.length; j++){
            if(datas[j].month == i){
                data1[i - 1] = datas[j].active_wallets_30 + datas[j].active_wallets_40;
                data2[i - 1] = datas[j].inactive_wallets_30 + datas[j].inactive_wallets_40;
            }
            
          }
        }
    
        this.chartDatasets = [
          {data: data2, label: 'Inactive'},
          {data: data1, label: 'Active'}
        ]

        this.setLoader(2, 'successful')
      }
    })

    this.subscription.push(sub)

  }

  // gets user input when year is changed
  switchPeriod(event) {
    this.getChart(event.target.value)
  }

  //routes to agents profile
  viewAgent(wallet){
    pageservice.setWallet(wallet)
    this.router.navigate(['/agent-profile'])
  }

  //routes to status page
  changeStatus(status){
    pageservice.setStatus(status)
    this.router.navigate(['/status'])
  }

}

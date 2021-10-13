import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment2 from 'moment-timezone';
import { formatDate } from '@angular/common';
import pageservice from 'app/_services/page.service';
import { Router } from '@angular/router';
import { AgentService } from 'app/_services/agent-profile.service';
import eventsService from 'app/_services/events.service';
import formatService from 'app/_services/format.service';


@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.scss']
})
export class AgentProfileComponent implements OnInit, OnDestroy {
  date = moment2(new Date()).tz('Africa/Lagos').format()
  date2 = moment2(new Date()).tz('Africa/Lagos').year()
  timer: any
  wallet: any = ''

  headers: any[] = ["Issue", "Count", "Last Updated"]

  ordered_data: any[] = ["issue", "count", "last_updated"]

  months: any[] = ['JAN', 'FEB', 'MAR', 'APRIL', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  years: any[] = []

  loaders: any[] = []

  issues: any[] = []

  data: any;

  subscription: any[] = []


  constructor(private router: Router, private agentService: AgentService) { }

  ngOnInit() {
    let sub
    sub =
      eventsService.getEvent('error').subscribe(url => {

        if (url.includes('agents/activity')) {
          this.setLoader(1, 'failed')
          let data1: any[] = []; let data2: any[] = [];
          let data3: any[] = []; let data4: any[] = [];
          let data5: any[] = []; let data6: any[] = [];
          let data7: any[] = []; let data8: any[] = [];
          let data9: any[] = [];
          this.chartDatasets = [
            { data: data2, label: 'Vas 4.0 Value' },
            { data: data1, label: 'Vas 3.0 Value' },
            { data: data3, label: 'Total Value' },
            { data: data4, label: 'Itex Profit' },
            { data: data5, label: 'Agent Profit' }
          ]
          this.chartDatasets2 = [
            { data: data6, label: 'Auto Fund' },
            { data: data7, label: 'Fund' },
            { data: data8, label: 'Deposit' },
            { data: data9, label: 'Total Funding' }
          ]
        }

        if (url.includes(`agents/${this.wallet}`)) {
          this.setLoader(0, 'failed')
        }

      })

    this.subscription.push(sub)

    this.wallet = pageservice.getWallet()

    for (let i = this.date2; i > (this.date2 - 10); i--) {
      this.years.push(i)
    }


    this.loaders = [undefined, undefined]

    sub =
      eventsService.getEvent('Agent-Filter').subscribe(data => {

        if (data) {
          if (data.search == "") {
            this.wallet = pageservice.getWallet()
          } else {
            this.wallet = data.search;
          }

          this.getAgent()
          this.getChart(this.date2)

        }

      })

    this.subscription.push(sub)

    if (this.wallet) {
      this.getAgent()
      this.getChart(this.date2)
    } else {
      this.router.navigate(['/dashboard'])
    }

  }

  ngOnDestroy() {
    clearInterval(this.timer);

    if (this.subscription) {
      for (let i = 0; i < this.subscription.length; i++) {
        this.subscription[i].unsubscribe()
      }
    }
  }

  public chartType: string = 'line';

  public chartDatasets: Array<any> = [];
  public chartDatasets2: Array<any> = [];

  public chartLabels: Array<any> = this.months;

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
    {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderColor: 'rgba(226, 226, 226, .7)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(226, 226, 226, 1)',

    },
    {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(37, 58, 102, 1)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(37, 58, 102, 1)',

    },
    {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'lightskyblue',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(0, 0, 255, 1)',

    }
  ];
  public chartColors2: Array<any> = [
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
   
    {
      backgroundColor:  'rgba(0, 0, 0, 0)',
      borderColor: '#253A66',
      borderWidth: 3,
      pointBackgroundColor:  'rgba(0, 0, 0, 0)',

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

              value = '₦' + value.toLocaleString();
            }
            return value;
          }
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
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

  ngAfterViewInit() {

    this.timer = interval()
    const dis = this
    function interval() {
      return setInterval(function () {
        let date = moment2(new Date()).tz('Africa/Lagos').format()
        document.getElementById(`timer`).innerHTML = formatDate(date, 'yyyy-MM-dd h:mm a', 'en');
      }, 1000)
    }
  }


  setLoader(index, status) {

    if (status == 'default') {
      this.loaders[index] = undefined

    }
    else if (status == 'successful') {
      this.loaders[index] = true
    } else {
      this.loaders[index] = false
    }
  }

  getAgent() {
    this.setLoader(0, 'default')
    let sub =

      this.agentService.getAgent(this.wallet).subscribe(data => {

        if (data) {
          for (let i = 0; i < data.issues.length; i++) {
            data.issues[i].last_updated = formatDate(data.issues[i].last_updated, 'yyyy-MM-dd hh:mm:ss', 'en');
          }
          this.data = data
          if (this.data.txn_value_30) {
            this.data.txn_value_30 = '₦' + formatService.formatCurrency(this.data.txn_value_30.toString())

          }

          if (this.data.txn_value_40) {
            this.data.txn_value_40 = '₦' + formatService.formatCurrency(this.data.txn_value_40.toString())

          }
          if (this.data.total_val_itex) {
            this.data.total_val_itex = '₦' + formatService.formatCurrency(this.data.total_val_itex.toString())

          }
          if (this.data.total_val_user) {
            this.data.total_val_user = '₦' + formatService.formatCurrency(this.data.total_val_user.toString())

          }
          if (this.data.txn_volume_30) {
            this.data.txn_volume_30 = formatService.formatNumber(this.data.txn_volume_30.toString())

          }

          if (this.data.txn_volume_40) {
            this.data.txn_volume_40 = formatService.formatNumber(this.data.txn_volume_40.toString())

          }

          this.setLoader(0, 'successful')

        }
      })

    this.subscription.push(sub)
  }

  getChart(year?) {
    this.chartDatasets = [],
      this.chartDatasets2 = [],

      this.setLoader(1, 'default')

    let datas = []

    let sub =
      this.agentService.getChart(this.wallet, year).subscribe(data => {
        if (data) {
          datas = data.results
          let fundData = data.total_funding;
          let data1: any[] = [];
          let data2: any[] = [];
          let data3: any[] = [];
          let data4: any[] = [];
          let data5: any[] = [];
          let data6: any[] = [];
          let data7: any[] = [];
          let data8: any[] = [];

          for (let i = 1; i <= 12; i++) {
            data1.push(0)
            data2.push(0)
            data3.push(0)
            data4.push(0)
            data5.push(0)
            data6.push(0)
            data7.push(0)
            data8.push(0)

            for (let j = 0; j < datas.length; j++) {
              if (datas[j].txn_mnth == i) {
                data1[i - 1] = datas[j].total_val_30 || 0;
                data2[i - 1] = (datas[j].total_val_40 || 0);
                data3[i - 1] = (datas[j].total_val_40 || 0) + (datas[j].total_val_30 || 0);
                data4[i - 1] = (datas[j].total_val_itex || 0);
                data5[i - 1] = (datas[j].total_val_agent || 0);

                data6[i - 1] = (datas[j].total_auto_fund || 0);
                data7[i - 1] = (datas[j].total_fund || 0);
                data8[i - 1] = (datas[j].total_deposit || 0);

              }

            }
          }

          this.chartDatasets = [
            { data: data2, label: 'Vas 4.0 Value' },
            { data: data1, label: 'Vas 3.0 Value' },
            { data: data3, label: 'Total Value' },
            { data: data4, label: 'Itex Profit' },
            { data: data5, label: 'Agent Profit' }

          ]
          this.chartDatasets2 = [
            { data: data6, label: 'Auto Fund' },
            { data: data7, label: 'Fund' },
            { data: data8, label: 'Deposit' },

          ]

          this.setLoader(1, 'successful')
        }
      })

    this.subscription.push(sub)
  }

  setIssues(issues: Array<any>) {

    this.issues = issues
  }

  switchPeriod(event) {
    this.date2 = event.target.value
    this.getChart(event.target.value)
  }
  viewPartner(irn){
    pageservice.setIrn(irn)
    this.router.navigate(['/trade-partner'])
  }
  viewNipTransaction(data){
    this.router.navigate(['/nip-transaction'])
  }
}

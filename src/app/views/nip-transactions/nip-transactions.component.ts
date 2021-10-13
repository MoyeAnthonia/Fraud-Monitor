import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import eventsService from 'app/_services/events.service';
import * as moment2 from 'moment-timezone';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import pageservice from 'app/_services/page.service';
import { WalletStatsService } from 'app/_services/wallet-stats.service';
import formatService from 'app/_services/format.service';
import { ExcelService } from 'app/_services/excel.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-nip-transactions',
  templateUrl: './nip-transactions.component.html',
  styleUrls: ['./nip-transactions.component.scss']
})
export class NipTransactionsComponent implements OnInit, OnDestroy {
  headers: any[] = ["S/N", "Date", "Opening Bal", "Total Funding", "Auto Fund", "Fund",
    "Deposit", "Txn value", "Txn Volume", "Closing Bal",]

  ordered_data: any[] = ["date", "opening_bal", "total_funding", "auto_fund", "fund", "deposit",
    "value", "volume", "closing_bal"]

  orderSelect: any[] = [{ value: 'asec', label: 'Ascending' }, { value: 'desc', label: 'Descending' }]
  sortSelect: any[] = [{ value: 'date', label: 'Date' }, { value: 'opening_bal', label: 'Opening Balance' },
  { value: 'closing_bal', label: 'Closing Balance' }, { value: 'auto_fund', label: 'Auto Fund' },
  { value: 'fund', label: 'Fund' }, { value: 'deposit', label: 'Deposit' },
  { value: 'value', label: 'Value' }, { value: 'volume', label: 'Volume' },
  ]

  data: any[] = []
  raw_data: any[] = []
  isLoading = true;
  loading = true;
  serial: number = 0
  limit: number = 50
  skip: number = 0
  total: number = 0
  end: number = 0
  status: any

  date = moment2(new Date()).tz('Africa/Lagos').format()
  timer: any
  search: string = ''
  searchName: string = 'search'
  subscription: any[] = []
  optionsSelect: any;
  OrderTypeSelect: string = 'asec';
  SortTypeSelect: any;
  start: any;
  irn: any;
  searchForm: FormGroup;
  isExport = true; isDisable = true;
  DateObj: any = new Date();

  @Input('wallet') wallet: any[] = []

  walletData: any;

  startDate: any; endDate: any;
  searchStart30: any; searchEnd30: any;
  searchStart40: any; searchEnd40: any; sorting: any;
  changeinuput: any;
  dateWallet: any; opening_bals: any; txn_vol: any;
  current_bal: any; total_inflow: any; total_txn_value: any;
  constructor(private excelservice: ExcelService, private fb: FormBuilder,
    private router: Router, private walletstatService: WalletStatsService) {
    this.searchForm = this.fb.group({
      selectOptions: [""],
      startDate: [""],
      endDate: [""],
      sortOptions: [""],
      orderOptions: [""]
    });
  }

  ngOnInit() {
    this.optionsSelect = [
      // { value: 'last_txn_date_30', label: 'Last Tnx Date 3.0' },
      { value: 'date', label: 'Date' },

    ];
    let sub
    sub =
      eventsService.getEvent('error').subscribe(url => {
        if (url.includes(`agents/activity/day/`)) {
          eventsService.getEvent('noTableData').emit(true)
        }
      })
    this.subscription.push(sub)
    this.status = pageservice.getStatus()

    if (this.status) {
      this.getNipTransaction();

    } else {
      this.router.navigate(['/dashboard'])
    }

    this.subscription.push(sub)


    sub =
      eventsService.getEvent(`${this.status}`).subscribe(status => {
        if (status == "next") {

          this.skip += this.limit
          if (this.OrderTypeSelect == 'asec') {
            this.getNipTransaction();
          } else if (this.OrderTypeSelect == 'desc') {
            this.getDescendStatus()
          }

        } else if (status == "previous") {

          this.skip -= this.limit

          if (this.skip < 0) {
            this.skip = 0
          }

          if (this.OrderTypeSelect == 'asec') {
            this.getNipTransaction();
          } else if (this.OrderTypeSelect == 'desc') {
            this.getDescendStatus()
          }

        }

      })

    this.subscription.push(sub)

  }

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

  ngOnDestroy() {
    clearInterval(this.timer);
    if (this.subscription) {
      for (let i = 0; i < this.subscription.length; i++) {
        this.subscription[i].unsubscribe()
      }
    }
  }
  SortType(event) {
    this.SortTypeSelect = event.value;
    if (this.OrderTypeSelect == 'asec') {
      this.getNipTransaction();
    } else if (this.OrderTypeSelect == 'desc') {
      this.getDescendStatus();
    }
  }

  OrderType(event) {
    this.OrderTypeSelect = event.value;
    if (this.OrderTypeSelect == 'asec') {
      this.getNipTransaction();
    } else if (this.OrderTypeSelect == 'desc') {
      this.getDescendStatus();
    }
  }


  type(event) {
    this.changeinuput = event.value;
  }

  filters() {
    this.search = this.searchForm.value.selectOptions;
    this.searchName = this.searchForm.value.selectedOption;
    this.startDate = this.searchForm.value.startDate;
    this.endDate = this.searchForm.value.endDate;

    this.getNipTransaction();

  }

  getNipTransaction() {
    this.isLoading = true;
    eventsService.getEvent('noTableData').emit()
    this.data = []
    this.raw_data = []
    let datas: any
    this.walletData = localStorage.getItem("wallet");

    let sub
    sub = this.walletstatService.getNipTransaction(this.limit, this.skip, this.walletData, this.SortTypeSelect,
      this.startDate, this.endDate).subscribe(data => {
        this.isLoading = false

        if (data.results.length) {
          datas = data
          this.data = datas.results;
          console.log(this.data)

          this.total = data.count

          this.serial = 1 + (this.skip / this.limit) * this.limit;
          this.end = (this.serial + this.data.length) - 1
          this.start = this.serial;
          for (let i = 0; i < this.data.length; i++) {
            this.dateWallet = this.data[0].date;
            this.opening_bals = this.data[0].opening_bal;
            this.current_bal = this.data[0].closing_bal;
            this.total_inflow = this.data[0].total_funding;
            this.total_txn_value = this.data[0].value;
            this.txn_vol = this.data[0].volume;

            if (this.data[i].closing_bal) {
              this.data[i].closing_bal = '₦' + formatService.formatCurrency(this.data[i].closing_bal.toString())
            }

            if (this.data[i].date) {
              this.data[i].date = formatService.
                formatDateTime(this.data[i].date);
            }
            if (this.data[i].opening_bal) {
              this.data[i].opening_bal = '₦' + formatService.formatCurrency(this.data[i].opening_bal.toString())
            }

            if (this.data[i].total_funding) {
              this.data[i].total_funding = '₦' + formatService.formatCurrency(this.data[i].total_funding.toString())
            }

            if (this.data[i].auto_fund) {
              this.data[i].auto_fund = '₦' + formatService.formatNumber(this.data[i].auto_fund.toString())
            }

            if (this.data[i].fund) {
              this.data[i].fund = '₦' + formatService.formatNumber(this.data[i].fund.toString())
            }

            if (this.data[i].deposit) {
              this.data[i].deposit = '₦' + formatService.formatNumber(this.data[i].deposit.toString())
            }

            if (this.data[i].value) {
              this.data[i].value = '₦' + formatService.formatNumber(this.data[i].value.toString())
            }
            if (this.data[i].volume) {
              this.data[i].volume = formatService.formatNumber(this.data[i].volume.toString())
            }
           

          }
        }
      },
        (error) => {
          this.isLoading = false;
          console.log("cant partner details", error);
        })


  }

  export() {
    this.isExport = false;
    this.raw_data = []
    eventsService.getEvent('noTableData').emit()
    let sub
    sub = this.walletstatService.getNipTransaction(this.total, this.skip, this.walletData, this.SortTypeSelect, this.startDate, this.endDate).subscribe(data => {
      this.raw_data = data.results

      this.excelservice.exportAsExcelFile(this.raw_data, `NIP TRANSACTIONS`)

    },
      (error) => {
        // this.isExport = false;
        console.log("cant export details", error);
      })

  }

  getDescendStatus() {
    eventsService.getEvent('noTableData').emit()
    this.data = []
    this.raw_data = []
    let datas: any
    let sub
    sub = this.walletstatService.getNipTransaction(this.limit, this.skip, this.walletData, `-${this.SortTypeSelect}`,
      this.startDate, this.endDate).subscribe(data => {

        if (data.results.length) {
          datas = data
          this.data = datas.results;
          this.total = data.count

          this.serial = 1 + (this.skip / this.limit) * this.limit;
          this.end = (this.serial + this.data.length) - 1
          this.start = this.serial;
          for (let i = 0; i < this.data.length; i++) {
            this.dateWallet = this.data[0].date;
            this.opening_bals = this.data[0].opening_bal;
            this.current_bal = this.data[0].closing_bal;
            this.total_inflow = this.data[0].total_funding;
            this.total_txn_value = this.data[0].value;
            this.txn_vol = this.data[0].volume;

            if (this.data[i].closing_bal) {
              this.data[i].closing_bal = '₦' + formatService.formatCurrency(this.data[i].closing_bal.toString())
            }

            if (this.data[i].date) {
              this.data[i].date = formatService.
                formatDateTime(this.data[i].date);
            }
            if (this.data[i].opening_bal) {
              this.data[i].opening_bal = '₦' + formatService.formatCurrency(this.data[i].opening_bal.toString())
            }

            if (this.data[i].total_funding) {
              this.data[i].total_funding = '₦' + formatService.formatCurrency(this.data[i].total_funding.toString())
            }

            if (this.data[i].auto_fund) {
              this.data[i].auto_fund = '₦' + formatService.formatNumber(this.data[i].auto_fund.toString())
            }

            if (this.data[i].fund) {
              this.data[i].fund = '₦' + formatService.formatNumber(this.data[i].fund.toString())
            }

            if (this.data[i].deposit) {
              this.data[i].deposit = '₦' + formatService.formatNumber(this.data[i].deposit.toString())
            }

            if (this.data[i].value) {
              this.data[i].value = '₦' + formatService.formatNumber(this.data[i].value.toString())
            }
            if (this.data[i].volume) {
              this.data[i].volume = formatService.formatNumber(this.data[i].volume.toString())
            }
           

          }
        }
        else {
          eventsService.getEvent('noTableData').emit(true)
        }
      })

  }
}

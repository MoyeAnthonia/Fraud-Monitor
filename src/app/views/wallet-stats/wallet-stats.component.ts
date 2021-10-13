import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import eventsService from 'app/_services/events.service';
import * as moment2 from 'moment-timezone';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import pageservice from 'app/_services/page.service';
import { WalletStatsService } from 'app/_services/wallet-stats.service';
import formatService from 'app/_services/format.service';
import { ExcelService } from 'app/_services/excel.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IMyOptions } from 'lib/ng-uikit-pro-standard';
import { PreserveSearchService } from 'app/_services/PreserveSearchService';

@Component({
  selector: 'app-wallet-stats',
  templateUrl: './wallet-stats.component.html',
  styleUrls: ['./wallet-stats.component.scss']
})
export class WalletStatsComponent implements OnInit, OnDestroy {


  headers: any[] = ["S/N", "Agent Name", "Email", "Day Value", "Day Volume", "Value 3.0", "Volume 3.0", "Last Tnx Date 3.0", "Value 4.0", "Volume 4.0", "Last Tnx Date 4.0", "Wallet Balance", "Agent Ranking", "User Type", "Date Created"]

  ordered_data: any[] = ["name", "email", "daily_value", "daily_volume", "txn_value_30", "txn_volume_30", "last_txn_date_30", "txn_value_40", "txn_volume_40", "last_txn_date_40", "wallet_bal", "top_20", "user_type", "acct_created"]
  userType: any[] = [
    { value: 'Agent', label: 'Agent' }, { value: 'B2b', label: 'B2B' },
    { value: 'B2br', label: 'B2BR' }, { value: 'Merchant', label: 'Merchant' },
    { value: 'staff', label: 'Staff' }, { value: 'User', label: 'User' },
    { value: 'none', label: 'None' },]
  orderSelect: any[] = [{ value: 'asec', label: 'Ascending' }, { value: 'desc', label: 'Descending' }]
  sortSelect: any[] = [{ value: 'name', label: 'Name' }, { value: 'email', label: 'Email' },
  { value: 'daily value', label: 'Daily Value' }, { value: 'daily volume', label: 'Daily Volume' },
  { value: 'txn_value_30', label: 'Txn Value 3.0' }, { value: 'txn_volume_30', label: 'Txn Volume 3.0' },
  { value: 'last_txn_date_30', label: 'Last Txn Date 3.0' }, { value: 'txn_value_40', label: 'Txn Value 4.0' },
  { value: 'txn_volume_40', label: 'Txn Volume 4.0' }, { value: 'last_txn_date_40', label: 'Last Txn Date 4.0' },
  { value: 'wallet_bal', label: 'Wallet Balance' }, { value: 'top_20', label: 'Agent Ranking' },
  { value: 'user_type', label: 'User Type' }, { value: 'acct_created', label: 'Date Created' },
  ]
  data: any[] = []
  raw_data: any[] = []

  serial: number = 0
  limit: number = 50
  skip: number = 0
  total: number = 0
  end: number = 0
  status: any
  // current_time: any =  moment2(new Date()).tz('Africa/Lagos')
  date = moment2(new Date()).tz('Africa/Lagos').format()
  timer: any

  search: string = ''
  searchName: string = 'search'
  subscription: any[] = []
  optionsSelect: any; userTypeSelect: any;
  // OrderTypeSelect: string ;
  OrderTypeSelect: string = 'asec';
  SortTypeSelect: any;
  start: any;


  searchForm: FormGroup;
  // userType: any;
  isExport = true; isDisable = true;
  DateObj: any = new Date();
  agent_totalVal: any; agent_totalVol: any; agent_count: any;
  users_totalVal: any; users_totalVol: any; users_count: any;
  staff_totalVal: any; staff_totalVol: any; staff_count: any;
  b2b_totalVal: any; b2b_totalVol: any; b2b_count: any;
  b2br_totalVal: any; b2br_totalVol: any; b2br_count: any;
  none_totalVal: any; none_totalVol: any; none_count: any;
  isLoading = true;

  startDate30: any; endDate30: any;
  startDate40: any; endDate40: any;
  searchStart30: any; searchEnd30: any;
  searchStart40: any; searchEnd40: any;
  private sorted = false;
  changeinuput: any; sorting: any;
  constructor(private excelservice: ExcelService, private fb: FormBuilder,
    private router: Router, private walletstatService: WalletStatsService,
    private preserveSearch: PreserveSearchService) {
    this.searchForm = this.fb.group({
      selectOptions: [""],
      selectedOption: [""],
      startDate: [""],
      startDate40: [""],
      endDate: [""],
      endDate40: [""],
      sortOptions: [""],
      orderOptions: [""]
    });
  }




  ngOnInit() {
    this.optionsSelect = [
      { value: 'search', label: 'Basic Search' },
      { value: 'search', label: 'Wallet ID' },
      { value: 'search', label: 'Phone No' },
      { value: 'search', label: 'Email' },
      { value: 'user_type', label: 'User Type' },
      { value: 'last_txn_date_30', label: 'Last Tnx Date 3.0' },
      { value: 'last_txn_date_40', label: 'Last Tnx Date 4.0' },

    ];
    // this.recoverLastSearchValue();
    let sub

    sub =
      eventsService.getEvent('error').subscribe(url => {
        if (url.includes('agents/?status')) {
          eventsService.getEvent('noTableData').emit(true)
        }
      })

    this.subscription.push(sub)
    this.status = pageservice.getStatus()

    if (this.status) {
      this.getStatus();
      this.getStatusSummary();
    } else {
      this.router.navigate(['/dashboard'])
    }

    this.subscription.push(sub)

    sub =
      eventsService.getEvent(`${this.status}`).subscribe(status => {
        if (status == "next") {

          this.skip += this.limit
          if (this.OrderTypeSelect == 'asec') {
            this.getStatus();
          } else if (this.OrderTypeSelect == 'desc') {
            this.getDescendStatus()
          }

        } else if (status == "previous") {

          this.skip -= this.limit

          if (this.skip < 0) {
            this.skip = 0
          }

          if (this.OrderTypeSelect == 'asec') {
            this.getStatus();
          } else if (this.OrderTypeSelect == 'desc') {
            this.getDescendStatus()
          }

        }

      })

    this.subscription.push(sub)

    sub =
      eventsService.getEvent('rowData').subscribe(row => {

        if (row) {
          if (row.wallet) {
            this.viewAgent(row.wallet)
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
    };
    //   this.preserveSearch.searchState = {
    //     searchValue: this.searchForm.value,
    //     results: this.data,
    //     resultsLength: this.resultsLength,
    // };
  }

  // recoverLastSearchValue() {
  //   const lastSearch = this.preserveSearch.searchState;
  //   if (lastSearch) {
  //       this.searchForm.setValue(lastSearch.searchValue, {
  //           emitEvent: false,
  //           emitModelToViewChange: false,
  //       });
  //       this.data = lastSearch.results;
  //       this.resultsLength = lastSearch.resultsLength;
  //   }}
  SortType(event) {
    this.SortTypeSelect = event.value;
    if (this.OrderTypeSelect == 'asec') {
      this.getStatus();
    } else if (this.OrderTypeSelect == 'desc') {
      this.getDescendStatus();
    }
  }

  OrderType(event) {
    this.OrderTypeSelect = event.value;
    if (this.OrderTypeSelect == 'asec') {
      this.getStatus();
    } else if (this.OrderTypeSelect == 'desc') {
      this.getDescendStatus();
    }
  }

  typeUser(event) {
    this.userTypeSelect = event.value;

  }
  type(event) {
    this.changeinuput = event.value;
  }
  filters() {
    this.search = this.searchForm.value.selectOptions;
    this.searchName = this.searchForm.value.selectedOption;
    this.startDate30 = this.searchForm.value.startDate;
    this.endDate30 = this.searchForm.value.endDate;
    this.startDate40 = this.searchForm.value.startDate40;
    this.endDate40 = this.searchForm.value.endDate40;
    // console.log('filters,', this.startDate30)

    this.getStatus();

  }

  getStatus() {
    eventsService.getEvent('noTableData').emit()
    this.data = []
    this.raw_data = []
    let datas: any
    let sub
    sub = this.walletstatService.getStatus(this.status, this.limit, this.skip, this.SortTypeSelect, this.search, this.searchName,
      this.startDate30, this.endDate30, this.startDate40, this.endDate40).subscribe(data => {

        if (data.results.length) {
          datas = data
          this.data = datas.results;
          this.total = datas.count


          this.serial = 1 + (this.skip / this.limit) * this.limit;
          this.end = (this.serial + this.data.length) - 1
          this.start = this.serial;
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].top_20 == true) {
              this.data[i].top_20 = 'Pro'
            } else {
              this.data[i].top_20 = ''
            }

            if (this.data[i].last_txn_date_40) {
              this.data[i].last_txn_date_40 = formatService.
                formatDateTime(this.data[i].last_txn_date_40);

            }
            if (this.data[i].last_txn_date_30) {
              this.data[i].last_txn_date_30 = formatService.
                formatDateTime(this.data[i].last_txn_date_30);
            }
            if (this.data[i].acct_created) {
              this.data[i].acct_created = formatService.
                formatDateTime(this.data[i].acct_created);

            }

            if (this.data[i].wallet_bal > 0 || this.data[i].wallet_bal == 0) {
              this.data[i].wallet_bal = '₦' + formatService.formatCurrency(this.data[i].wallet_bal.toString())

            }
            if (this.data[i].wallet_bal < 0) {
              this.data[i].wallet_bal = '-₦' + formatService.formatCurrency(this.data[i].wallet_bal.toString())
            }

            if (this.data[i].txn_value_30) {
              this.data[i].txn_value_30 = '₦' + formatService.formatCurrency(this.data[i].txn_value_30.toString())
            }

            if (this.data[i].txn_value_40) {
              this.data[i].txn_value_40 = '₦' + formatService.formatCurrency(this.data[i].txn_value_40.toString())
            }

            if (this.data[i].txn_volume_30) {
              this.data[i].txn_volume_30 = formatService.formatNumber(this.data[i].txn_volume_30.toString())
            }

            if (this.data[i].txn_volume_40) {
              this.data[i].txn_volume_40 = formatService.formatNumber(this.data[i].txn_volume_40.toString())
            }

            if (this.data[i].daily_value) {
              this.data[i].daily_value = formatService.formatCurrency(this.data[i].daily_value.toString())
            }

            if (this.data[i].daily_volume) {
              this.data[i].daily_volume = formatService.formatCurrency(this.data[i].daily_volume.toString())
            }

          }
        }
        else {
          eventsService.getEvent('noTableData').emit(true)
        }
      })

  }

  getStatusSummary() {
    this.isLoading = true;
    let datas: any
    let sub
    sub = this.walletstatService.getStatusSummary(this.status).subscribe(data => {
      if (data.results.length) {
        this.isLoading = false;
        datas = data.results;

        this.agent_totalVal = formatService.formatCurrency(datas[1].total_value.toString())
        this.agent_totalVol = formatService.formatNumber(datas[1].total_volume.toString())
        this.agent_count =  formatService.formatNumber(datas[1].count.toString())

        this.b2b_totalVal = formatService.formatCurrency(datas[2].total_value.toString())
        this.b2b_totalVol = formatService.formatNumber(datas[2].total_volume.toString())
        this.b2b_count = formatService.formatNumber(datas[2].count.toString())

        this.b2br_totalVal = formatService.formatCurrency(datas[3].total_value.toString())
        this.b2br_totalVol = formatService.formatNumber(datas[3].total_volume.toString())
        this.b2br_count = formatService.formatNumber(datas[3].count.toString())

        this.none_totalVal = formatService.formatCurrency(datas[4].total_value.toString())
        this.none_totalVol = formatService.formatNumber(datas[4].total_volume.toString())
        this.none_count = formatService.formatNumber(datas[4].count.toString())

        this.staff_totalVal = formatService.formatCurrency(datas[5].total_value.toString())
        this.staff_totalVol = formatService.formatNumber(datas[5].total_volume.toString())
        this.staff_count = formatService.formatNumber(datas[5].count.toString())

        this.users_totalVal = formatService.formatCurrency(datas[6].total_value.toString())
        this.users_totalVol = formatService.formatNumber(datas[6].total_volume.toString())
        this.users_count = formatService.formatNumber(datas[6].count.toString())

      }
    })


  }

  export() {
    this.isExport = false;
    this.raw_data = []
    eventsService.getEvent('noTableData').emit()
    let sub
    sub = this.walletstatService.getStatus(this.status, this.total, this.skip, this.SortTypeSelect, this.search, this.searchName,
      this.startDate30, this.endDate30, this.startDate40, this.endDate40).subscribe(data => {
        this.raw_data = data.results

        this.excelservice.exportAsExcelFile(this.raw_data, `${this.status}-wallet`)

      },
        (error) => {
          // this.isExport = false;
          console.log("cant export details", error);
        })

  }

  viewAgent(wallet) {
    pageservice.setWallet(wallet)
    this.router.navigate(['/agent-profile'])
  }


  getDescendStatus() {
    eventsService.getEvent('noTableData').emit()
    this.data = []
    this.raw_data = []
    let datas: any
    let sub
    sub = this.walletstatService.getStatus(this.status, this.limit, this.skip, `-${this.SortTypeSelect}`, this.search, this.searchName,
      this.startDate30, this.endDate30, this.startDate40, this.endDate40).subscribe(data => {

        if (data.results.length) {
          datas = data
          this.data = datas.results;
          this.total = datas.count


          this.serial = 1 + (this.skip / this.limit) * this.limit;
          this.end = (this.serial + this.data.length) - 1
          this.start = this.serial;
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].top_20 == true) {
              this.data[i].top_20 = 'Pro'
            } else {
              this.data[i].top_20 = ''
            }

            if (this.data[i].last_txn_date_40) {
              this.data[i].last_txn_date_40 = formatService.
                formatDateTime(this.data[i].last_txn_date_40);

            }
            if (this.data[i].last_txn_date_30) {
              this.data[i].last_txn_date_30 = formatService.
                formatDateTime(this.data[i].last_txn_date_30);
            }
            if (this.data[i].acct_created) {
              this.data[i].acct_created = formatService.
                formatDateTime(this.data[i].acct_created);

            }

            if (this.data[i].wallet_bal > 0 || this.data[i].wallet_bal == 0) {
              this.data[i].wallet_bal = '₦' + formatService.formatCurrency(this.data[i].wallet_bal.toString())

            }
            if (this.data[i].wallet_bal < 0) {
              this.data[i].wallet_bal = '-₦' + formatService.formatCurrency(this.data[i].wallet_bal.toString())
            }

            if (this.data[i].txn_value_30) {
              this.data[i].txn_value_30 = '₦' + formatService.formatCurrency(this.data[i].txn_value_30.toString())
            }

            if (this.data[i].txn_value_40) {
              this.data[i].txn_value_40 = '₦' + formatService.formatCurrency(this.data[i].txn_value_40.toString())
            }

            if (this.data[i].txn_volume_30) {
              this.data[i].txn_volume_30 = formatService.formatNumber(this.data[i].txn_volume_30.toString())
            }

            if (this.data[i].txn_volume_40) {
              this.data[i].txn_volume_40 = formatService.formatNumber(this.data[i].txn_volume_40.toString())
            }

            if (this.data[i].daily_value) {
              this.data[i].daily_value = formatService.formatCurrency(this.data[i].daily_value.toString())
            }

            if (this.data[i].daily_volume) {
              this.data[i].daily_volume = formatService.formatCurrency(this.data[i].daily_volume.toString())
            }

          }
        }
        else {
          eventsService.getEvent('noTableData').emit(true)
        }
      })

  }

}

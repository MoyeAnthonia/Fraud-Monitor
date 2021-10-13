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

@Component({
  selector: 'app-trade-partner',
  templateUrl: './trade-partner.component.html',
  styleUrls: ['./trade-partner.component.scss']
})
export class TradePartnerComponent implements OnInit, OnDestroy {
  headers: any[] = ["S/N", "Agent Name", "Email", "Day Value", "Day Volume", "Value 3.0", "Volume 3.0", "Last Tnx Date 3.0", "Value 4.0", "Volume 4.0", "Last Tnx Date 4.0", "Wallet Balance", "Agent Ranking", "User Type", "Date Created"]

  ordered_data: any[] = ["name", "email", "daily_value", "daily_volume", "txn_value_30", "txn_volume_30", "last_txn_date_30", "txn_value_40", "txn_volume_40", "last_txn_date_40", "wallet_bal", "top_20", "user_type", "acct_created"]
  userType: any[] = [
    { value: 'Agent', label: 'Agent' }, { value: 'B2b', label: 'B2B' },
    { value: 'B2br', label: 'B2BR' }, { value: 'Merchant', label: 'Merchant' },
    { value: 'staff', label: 'Staff' }, { value: 'User', label: 'User' },
    { value: 'none', label: 'None' },]
  walletStatus: any[] = [
    { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' },
    { value: 'invalid', label: 'Invalid' }, { value: 'not_in_use', label: 'Not In Use' },

  ]
  orderSelect: any[] = [{ value: 'asec', label: 'Ascending' }, { value: 'desc', label: 'Descending' }]
  sortSelect: any[] = [{ value: 'name', label: 'Name' }, { value: 'email', label: 'Email' },
  { value: 'daily_value', label: 'Daily Value' }, { value: 'daily_volume', label: 'Daily Volume' },
  { value: 'txn_value_30', label: 'Txn Value 3.0' }, { value: 'txn_volume_30', label: 'Txn Volume 3.0' },
  { value: 'last_txn_date_30', label: 'Last Txn Date 3.0' }, { value: 'txn_value_40', label: 'Txn Value 4.0' },
  { value: 'txn_volume_40', label: 'Txn Volume 4.0' }, { value: 'last_txn_date_40', label: 'Last Txn Date 4.0' },
  { value: 'wallet_bal', label: 'Wallet Balance' }, { value: 'top_20', label: 'Agent Ranking' },
  { value: 'user_type', label: 'User Type' }, { value: 'acct_created', label: 'Date Created' },
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
  optionsSelect: any; userTypeSelect: any;
  OrderTypeSelect: string = 'asec';
  SortTypeSelect: any;
  start: any;
  irn: any;
  searchForm: FormGroup;
  isExport = true; isDisable = true;
  DateObj: any = new Date();


  startDate30: any; endDate30: any;
  startDate40: any; endDate40: any;
  searchStart30: any; searchEnd30: any;
  searchStart40: any; searchEnd40: any; sorting: any;
  changeinuput: any; activeWallet_count: any; inactiveWallet_count: any;
  agent_count: any; total_agent_value: any; total_agent_volume: any;
  name: any; address: any; phone: any; date_created: any;
  active_agents_volume: any; active_agents_value:any;
  inactive_agents_volume: any; inactive_agents_value:any;
  average_per_volume: any; average_per_value:any;
  constructor(private excelservice: ExcelService, private fb: FormBuilder,
    private router: Router, private walletstatService: WalletStatsService) {
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
      { value: 'status', label: 'Wallet Status' },
      { value: 'last_txn_date_30', label: 'Last Tnx Date 3.0' },
      { value: 'last_txn_date_40', label: 'Last Tnx Date 4.0' },

    ];
    let sub
    sub =
      eventsService.getEvent('error').subscribe(url => {
        if (url.includes(`tps/${this.irn}`)) {
          eventsService.getEvent('noTableData').emit(true)
        }
      })
    this.subscription.push(sub)
    this.irn = pageservice.getIrn()

    if (this.irn) {
      this.getPartner();
      this.getPartnerAgent();

    } else {
      this.router.navigate(['/dashboard'])
    }

    this.subscription.push(sub)

    sub =
      eventsService.getEvent(`${this.irn}`).subscribe(irn => {
        if (irn == "next") {

          this.skip += this.limit
          if (this.OrderTypeSelect == 'asec') {
            this.getPartnerAgent();
          } else if (this.OrderTypeSelect == 'desc') {
            this.getDescendStatus()
          }

        } else if (irn == "previous") {

          this.skip -= this.limit

          if (this.skip < 0) {
            this.skip = 0
          }
          if (this.OrderTypeSelect == 'asec') {
            this.getPartnerAgent();
          } else if (this.OrderTypeSelect == 'desc') {
            this.getDescendStatus()
          }

        }

      })

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
    }
  }
  SortType(event) {
    this.SortTypeSelect = event.value;
    if (this.OrderTypeSelect == 'asec') {
      this.getPartnerAgent();
    } else if (this.OrderTypeSelect == 'desc') {
      this.getDescendStatus();
    }
  }

  OrderType(event) {
    this.OrderTypeSelect = event.value;
    if (this.OrderTypeSelect == 'asec') {
      this.getPartnerAgent();
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
  walletStats(event) {
    this.status = event.value;
  }
  filters() {
    this.search = this.searchForm.value.selectOptions;
    this.searchName = this.searchForm.value.selectedOption;
    this.startDate30 = this.searchForm.value.startDate;
    this.endDate30 = this.searchForm.value.endDate;
    this.startDate40 = this.searchForm.value.startDate40;
    this.endDate40 = this.searchForm.value.endDate40;
    // console.log('filters,', this.searchName)

    this.getPartnerAgent();
    // this.startDate30.reset()

  }

  getPartner() {
    this.isLoading = true;
    eventsService.getEvent('noTableData').emit()
    this.data = []
    this.raw_data = []
    let sub

    sub = this.walletstatService.getPartner(this.irn).subscribe(data => {
      this.isLoading = false
      this.agent_count = data.agent_count; this.total_agent_value = data.total_agent_value;
      this.name = data.name; this.total_agent_volume = data.total_agent_volume;
      this.address = data.address; this.phone = data.phone;
      this.date_created = data.date_created;
      this.inactiveWallet_count = data.total_inactive_agents; this.activeWallet_count = data.total_active_agents;
this.active_agents_volume = data.active_agents_stats.total_vol; this.active_agents_value = data.active_agents_stats.total_val; 
this.inactive_agents_volume = data.inactive_agents_stats.total_vol; this.inactive_agents_value = data.inactive_agents_stats.total_val; 
   this.average_per_value = this.total_agent_value / this.agent_count;
   this.average_per_volume = this.total_agent_volume / this.agent_count;
},
      (error) => {
        this.isLoading = false;
        console.log("cant partner details", error);
      })


  }

  getPartnerAgent() {
    this.loading = true;
    eventsService.getEvent('noTableData').emit()
    this.data = []
    this.raw_data = []
    let datas: any

    let sub

    sub = this.walletstatService.getPartnerAgent(this.irn, this.status, this.limit, this.skip, this.SortTypeSelect, this.search, this.searchName,
      this.startDate30, this.endDate30, this.startDate40, this.endDate40).subscribe(data => {
        this.loading = false
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

            if (this.data[i].wallet_bal) {
              this.data[i].wallet_bal = '₦' + formatService.formatCurrency(this.data[i].wallet_bal.toString())
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

  export() {
    this.isExport = false;
    this.raw_data = []
    eventsService.getEvent('noTableData').emit()
    let sub
    sub = this.walletstatService.getPartnerAgent(this.irn, this.status, this.total, this.skip, this.SortTypeSelect, this.search, this.searchName,
      this.startDate30, this.endDate30, this.startDate40, this.endDate40).subscribe(data => {
        this.raw_data = data.results

        this.excelservice.exportAsExcelFile(this.raw_data, `Trade Partner`)

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

            if (this.data[i].wallet_bal) {
              this.data[i].wallet_bal = '₦' + formatService.formatCurrency(this.data[i].wallet_bal.toString())
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

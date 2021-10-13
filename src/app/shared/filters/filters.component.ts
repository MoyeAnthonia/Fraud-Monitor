import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import eventsService from 'app/_services/events.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
isDisable = true;
  searchName: any = 'search'
  search: any = ""
  @Input('filter') filter = 'all'
  @Input('event') event: any
changeinuput: any;
  optionsSelect: Array<any>;

  constructor() { }

  ngOnInit() {


    if (this.filter == 'all') {
      this.optionsSelect = [
        { value: 'search', label: 'Basic Search' },
        { value: 'wallet', label: 'Wallet ID' },
        { value: 'phone', label: 'Phone No' },
        { value: 'email', label: 'Email' },
        { value: 'user_type', label: 'User Type' },
        { value: 'last_txn_date_30', label: 'Last Tnx Date 3.0' },
        { value: 'last_txn_date_40', label: 'Last Tnx Date 4.0' },

      ];
    } else if (this.filter == 'wallet') {
      this.optionsSelect = [
        { value: 'wallet', label: 'Wallet ID' },
      ];

      this.searchName = 'wallet'
    }
  }

  type(event){
    this.changeinuput = event.target.value;
    if(event.target.value.includes("date")){
      document.getElementById("input").setAttribute("type", "date")
    }else{
      document.getElementById("input").setAttribute("type", "text")
    }
  }

  filters(){
        const event = eventsService.getEvent(this.event)
    event.emit({searchName: this.searchName, search: this.search, 
    })
  }

}

import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import eventsService from 'app/_services/events.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  @Input('headers') headers: any[] = []
  @Input('datas') datas: any[] = []
  @Input('ordered_data') ordered_data: any[] = []
  @Input('serial') serial: number
  isData: boolean
  subscription: any
  booleanValue: any = false;
  private sorted = false;

  constructor() { }

  ngOnInit() {
    this.subscription =
    eventsService.getEvent('noTableData').subscribe((status) => {

      if(status){
        this.isData = false
      }else {
        this.isData = true
      }
        

    })

  }

  sendData(data){
    eventsService.getEvent('rowData').emit(data)
  }


  // sortBy(by: string | any): void {

  //   this.datas.sort((a: any, b: any) => {
  //     if (a[by] < b[by]) {
  //       return this.sorted ? 1 : -1;
  //     }
  //     if (a[by] > b[by]) {
  //       return this.sorted ? -1 : 1;
  //     }

  //     return 0;
  //   });

  //   this.sorted = !this.sorted;
  // }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe()
    }
  }

}
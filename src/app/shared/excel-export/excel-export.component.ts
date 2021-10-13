import { Component, OnInit, Input } from '@angular/core';
import { ExcelService } from 'app/_services/excel.service';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrls: ['./excel-export.component.scss']
})


export class ExcelExportComponent implements OnInit {

  @Input('datas') datas: any[] = [];
  @Input ('filename') filename: string

  constructor( private excelservice: ExcelService) { }

  ngOnInit() {

   
  }

  export(){
    this.excelservice.exportAsExcelFile(this.datas, this.filename)
  }

}

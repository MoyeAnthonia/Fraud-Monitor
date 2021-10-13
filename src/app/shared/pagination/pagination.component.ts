import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import eventsService from 'app/_services/events.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input('event') event: any
  @Input('state') state: string
  @Input('total') total: number
  @Input('start') start: number
  @Input('end') end: number
  constructor() { }

  ngOnInit() {
  }

  changePage() {

    const event = eventsService.getEvent(this.event)
    event.emit(this.state);

  }

}

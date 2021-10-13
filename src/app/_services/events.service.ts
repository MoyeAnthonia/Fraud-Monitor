import { EventEmitter } from '@angular/core';
import { KeyboardEvent } from 'ng-uikit-pro-standard';

class EventService {

    events: any[] = [];

    getEvent(key): EventEmitter<any> {
        if(!this.events[key]) {
            this.events[key] = new EventEmitter();
        }

        return this.events[key];
    }

}

export default new EventService()
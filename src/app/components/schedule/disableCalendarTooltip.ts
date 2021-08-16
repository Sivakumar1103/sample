import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { Injectable } from '@angular/core';

@Injectable()
export class DisableCalendarTooltip extends CalendarEventTitleFormatter {
  // you can override any of the methods defined in the parent class

  monthTooltip(event: CalendarEvent): any {
    return;
  }

  weekTooltip(event: CalendarEvent): any {
    return;
  }

  dayTooltip(event: CalendarEvent): any {
    return;
  }
}

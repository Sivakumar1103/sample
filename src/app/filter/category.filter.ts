import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryfilter'
})

export class CategoryfilterPipe implements PipeTransform {
  transform(items: string[], filter: string): any {
    if (!items || !filter || filter.length === 0) {
      return items;
    }
    return items.filter(item => {
      return item.toLowerCase().indexOf(filter) > -1;
    });
  }
}

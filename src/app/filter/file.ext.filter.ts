import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtFilter'
})
export class FileExtfilterPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter || filter.length === 0) {
        return items;
    }
    return items.filter(item => {
        return item.Key.split('.').pop().toLowerCase() === filter;
    });
}
}

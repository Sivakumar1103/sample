import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postfilter'
})
export class PostfilterPipe implements PipeTransform {
  transform(items: any[], filter: Object[]): any {
    if (!items || !filter || filter.length === 0) {
        return items;
    }
    return items.filter(item => {
      if(item.pageId) {
        return (filter.some((e: any) => e.socialId.split('-')[e.socialId.split('-').length-1] === item.pageId));
      } else if(item.userId) {
        return (filter.some((e: any) => e.socialId.split('-')[e.socialId.split('-').length-1] === item.userId));
      }
      return false;
    });
}
}

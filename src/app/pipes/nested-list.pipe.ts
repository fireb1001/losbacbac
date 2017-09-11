import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nestedList'
})
export class NestedListPipe implements PipeTransform {

  transform(obj: any, args?: any): any {
    const result = [];
    if (obj && Object.keys(obj)) {
      Object.keys(obj).forEach(function(key){
          result.push(obj[key]);
      });
    }
    return result;
  }

}

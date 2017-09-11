import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listItemAttr'
})
export class ListItemAttrPipe implements PipeTransform {

  transform( allItems: any[] , attr: any , extend?: any): any {

    if ( allItems) {
      if ( extend) {
        if (extend.operator && extend.operator === '*') {
          // return allItems;
        } else if (extend.operator && extend.operator === '!') {
          return allItems.filter( item => item[attr.key][extend.key] !== extend.value);
        } else {
          return allItems.filter( item => item[attr.key][extend.key] === extend.value);
        }
      } else {
        if (attr.operator && attr.operator === '*') {
          return allItems;
        } else if (attr.operator && attr.operator === '!') {
          return allItems.filter( item => item[attr.key] !== attr.value );
        } else {
          return allItems.filter( item => item[attr.key] === attr.value );
        }
      }
    }
    return null;
  }

}

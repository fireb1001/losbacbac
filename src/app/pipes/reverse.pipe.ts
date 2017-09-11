import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(arr) {
    if (!arr) {
      return;
    }
    return arr.slice().reverse();
  }

}

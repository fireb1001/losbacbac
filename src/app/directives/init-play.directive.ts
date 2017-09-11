import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appInitPlay]'
})
export class InitPlayDirective {

  @Input() appInitPlay;
  ngOnInit() {
      if (this.appInitPlay) {
          this.appInitPlay();
      }
  }
}

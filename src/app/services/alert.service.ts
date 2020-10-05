import { Injectable } from '@angular/core';
declare const $: any;

@Injectable()
export class AlertService {

  constructor() { }

  public showNotification(msg : string, position : string, type : string) {
    let from = 'top';
    let align = 'right';

    switch (position) {
      case 'top-left':
        align = 'left';
        break;

      case 'top-center':
        align = 'center';
        break;

      case 'bottom-left':
        align = 'left';
        from = 'bottom';
        break;

      case 'bottom-center':
        align = 'center';
        from = 'bottom';
        break;

      case 'bottom-right':
        from = 'bottom';
        break;
    }

    this.buildNotification(msg, from, align, type);
  }

  public showSuccessNotification(msg: string) {
    this.showNotification(msg, 'top-center', 'success');
  }

  public showWarninngNotification(msg: string) {
    this.showNotification(msg, 'top-center', 'warning');
  }

  public showErrorNotification(msg: string) {
    this.showNotification(msg, 'top-center', 'danger');
  }

  private buildNotification(msg : string, from : string, align : string, type : string) {

    $.notify({
      message: msg,
    }, {
      placement: {from, align},
      offset: {x: 20, y: 35},
      type,
      template: `<div class="alert alert-{0} alert-with-icon col-md-4">
          <i class="material-icons alert-icon">notifications</i>
          <button class="close" type="button" data-dismiss="alert" aria-label="Close"><i class="material-icons">close</i></button>
          <span>{2}</span>
        </div>`
    });
  }

}

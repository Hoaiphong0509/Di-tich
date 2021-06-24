import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../_modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModalRef: BsModalRef;

  constructor(private bsModalService: BsModalService) {

  }

  confirm(
    title = "Xác nhận",
    message = "Bạn có chắc muốn thực hiện thao tác này?",
    btnOkText = 'Ok',
    btnCancelText = 'Huỷ'): Observable<boolean> {
      const config = {
        initialState: {
          title,
          message,
          btnOkText,
          btnCancelText
        }
      }

    this.bsModalRef = this.bsModalService.show(ConfirmDialogComponent, config);
    
    return new Observable<boolean>(this.getResult());
  }

  private getResult(){
    return(observer) => {
      const subscription = this.bsModalRef.onHidden.subscribe(()=>{
        observer.next(this.bsModalRef.content.result);
        observer.complete();
      });

      return {
        unsubscribe(){
          subscription.unsubscribe();
        }
      }
    }
  }
}

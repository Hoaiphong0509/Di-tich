import { ConfirmService } from './../../_services/confirm.service';
import { Component, OnInit } from '@angular/core';
import { Relic } from 'src/app/_models/relic';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-relic-management',
  templateUrl: './relic-management.component.html',
  styleUrls: ['./relic-management.component.css']
})
export class RelicManagementComponent implements OnInit {
  relics: Relic[]

  constructor(private adminService: AdminService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.getPhotosForApproval()
  }

  getPhotosForApproval() {
    this.adminService.getRelicForApproval().subscribe(relics => {
      this.relics = relics;
    })
  }
    
  approveRelic(relicId) {
    this.confirmService.confirm('Bạn có muốn phê bài viết này?', 'Thao tác này không thể hoàn tác').subscribe(result => {
      if(result){
        this.adminService.approveRelic(relicId).subscribe(() => {
          this.relics.splice(this.relics.findIndex(p => p.id === relicId), 1);
          // this.relics =  this.relics.filter(r => r.isApproved == false && r.isReject == false)
        })
      }
    })
  }

  rejectRelic(relicId) {
    this.confirmService.confirm('Bạn có muốn từ chối bài viết này?', '').subscribe(result => {
      if(result){
        this.adminService.rejectRelic(relicId).subscribe(() => {
          this.relics.splice(this.relics.findIndex(p => p.id === relicId), 1);
          // this.relics =  this.relics.filter(r => r.isApproved == false && r.isReject == false)
        })
      }
    })
  }
}

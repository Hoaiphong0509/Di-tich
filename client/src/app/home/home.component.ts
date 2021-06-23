import { Router } from '@angular/router';
import { PageParams } from './../_models/pageParams';
import { Pagination } from './../_models/pagination';
import { Relic } from './../_models/relic';
import { RelicService } from './../_services/relic.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  relics: Relic[];
  pagination: Pagination;
  pageParams: PageParams = new PageParams();

  constructor(private relicService: RelicService, private router: Router) { }

  ngOnInit(): void {
    this.loadRelics();
  }

  loadRelic(relicid: number){
    this.relicService.getRelic(relicid).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('detail/'+relicid)
    })
  }

  loadRelics(){
    this.relicService.getRelics(this.pageParams).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any){
    this.pageParams.pageNumber = event.page;
    this.loadRelics();
  }

}

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

  constructor(private relicService: RelicService) { }

  ngOnInit(): void {
    this.loadRelics();
  }

  setRelic(relic: Relic){
    this.relicService.setCurrentRelic(relic)
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

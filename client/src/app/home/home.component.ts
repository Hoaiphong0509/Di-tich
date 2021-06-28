import { Pagination } from 'src/app/_models/pagination';
import { RelicParams } from './../_models/relicParams';
import { Router } from '@angular/router';
import { PageParams } from './../_models/pageParams';
import { Relic } from './../_models/relic';
import { RelicService } from './../_services/relic.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  relics: Relic[];
  pagination: Pagination = {} as Pagination;
  pageParams: PageParams = new PageParams();
  relicParams: RelicParams;

  searchForm: FormGroup;
  myControl = new FormControl();
  options: string[] = this.getNameRelics();
  filteredOptions: Observable<string[]>;

  relicsResearch: Relic[] = [];

  constructor(private relicService: RelicService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('relic')) {
      localStorage.removeItem('relic');
    }


    this.loadRelics()

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.initializeForm()
  }

  loadRelics() {
    this.relicService.getApprovedRelics(this.pageParams).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.pageParams.pageNumber = event.page;
    this.loadRelics();
  }

  initializeForm() {
    this.searchForm = new FormGroup({
      name: this.myControl
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private getNameRelics() {
    const name: string[] = [];
    this.relicService.getAllRelic().subscribe(relics => {
      relics.forEach(relic => {
        name.push(relic.name)
      });
    })

    return name;
  }

  private suggest(relicSearch: string) {
    const relicsResearch: Relic[] = [];
    this.relicService.getAllRelic().subscribe(relics => {
      relics.forEach(relic => {
        const temp = relic.name.split(" ");
        const tempUnmark = relic.nameUnmark.split(" ");
        temp.concat(tempUnmark).forEach(element => {
          if(relicSearch.toLowerCase().indexOf(element.toLowerCase()) >= 0){
            relicsResearch.push(relic)
          }
        });
      });

      this.relicsResearch = relicsResearch;
    })
  }

  search() {
    this.relicService.getRelicsByName(this.searchForm.value.name).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    });

    this.suggest(this.searchForm.value.name);
  }

  research(name: string){
    this.relicService.getRelicsByName(name).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    });
  }
}

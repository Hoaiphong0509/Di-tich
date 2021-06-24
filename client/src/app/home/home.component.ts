import { Router } from '@angular/router';
import { PageParams } from './../_models/pageParams';
import { Pagination } from './../_models/pagination';
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
  pagination: Pagination;
  pageParams: PageParams = new PageParams();

  searchForm: FormGroup;
  model: any;
  myControl = new FormControl();
  options: string[] = this.getNameRelics();
  filteredOptions: Observable<string[]>;

  constructor(private relicService: RelicService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('relic') || localStorage.getItem('member')) {
      localStorage.removeItem('relic');
      localStorage.removeItem('member');
    }


    this.loadRelics()

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.initializeForm()

  }

  loadRelic(relicid: number) {
    this.relicService.getRelic(relicid).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('detail/' + relicid)
    })
  }

  loadRelics() {
    this.relicService.getRelics(this.pageParams).subscribe(response => {
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


  search() {
    this.relicService.getRelicsByName(this.searchForm.value.name).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
      console.log(this.relics)
    });
  }
}

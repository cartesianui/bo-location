import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListingControlsComponent } from '@cartesianui/common';
import { Subscription } from 'rxjs';
import { RequestCriteria } from '@cartesianui/core';
import { LocationSandbox } from '../../../location.sandbox';
import { City, SearchCityForm } from '../../../models';

@Component({
  selector: 'list-cities',
  templateUrl: './list-cities.component.html'
})
export class ListCitiesComponent extends ListingControlsComponent<City, SearchCityForm> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dtContainer') dtContainer: ElementRef;

  subscriptions: Array<Subscription> = [];
  selectedCities: City[] = [];
  criteria = new RequestCriteria<SearchCityForm>(new SearchCityForm());
  searchModel = '';

  constructor(protected _sandbox: LocationSandbox, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.registerEvents();
  }

  ngAfterViewInit(): void {
    this.reloadTable();
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  search(): void {
    this.setPage(1);
    if (this.searchModel) {
      this.criteria.where('name', 'like', this.searchModel);
    } else {
      this.criteria.where('name', 'like', '');
    }
    this.list();
  }

  protected registerEvents() {
    this.subscriptions.push(
      this._sandbox.citiesData$.subscribe((data: City[]) => {
        if (data) {
          this.data = Object.values(data);
        }
        this.ui.clearBusy();
        this.isTableLoading = false;
      })
    );
    this.subscriptions.push(
      this._sandbox.citiesMeta$.subscribe((meta: any) => {
        if (meta) {
          this.pagination = meta.pagination;
        }
      })
    );
  }

  protected list(): void {
    this.ui.setBusy(this.dtContainer.nativeElement);
    this.isTableLoading = true;
    this._sandbox.fetchCities(this.criteria);
  }
  protected delete(): void {}

  onSelect({ selected }) {
    this.selectedCities.splice(0, this.selectedCities.length);
    this.selectedCities.push(...selected);
  }

  onActivate(event) {}
}

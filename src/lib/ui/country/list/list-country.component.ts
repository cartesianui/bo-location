import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListingControlsComponent } from '@cartesianui/common';
import { RequestCriteria } from '@cartesianui/core';
import { Subscription } from 'rxjs';
import { LocationSandbox } from '../../../location.sandbox';
import { Country, SearchCountryForm } from '../../../models';

@Component({
  selector: 'list-country',
  templateUrl: './list-country.component.html'
})
export class ListCountryComponent extends ListingControlsComponent<Country, SearchCountryForm> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dtContainer') dtContainer: ElementRef;

  subscriptions: Array<Subscription> = [];
  selectedCountries: Country[] = [];
  criteria = new RequestCriteria<SearchCountryForm>(new SearchCountryForm());
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
    } // TODO: Remove where
    this.list();
  }

  protected registerEvents() {
    this.subscriptions.push(
      this._sandbox.countriesData$.subscribe((data: Country[]) => {
        if (data) {
          this.data = Object.values(data);
        }
        this.ui.clearBusy();
        this.isTableLoading = false;
      })
    );
    this.subscriptions.push(
      this._sandbox.countriesMeta$.subscribe((meta: any) => {
        if (meta) {
          this.pagination = meta.pagination;
        }
      })
    );
  }

  protected list(): void {
    this.ui.setBusy(this.dtContainer.nativeElement);
    this.isTableLoading = true;
    this._sandbox.fetchCountries(this.criteria);
  }

  protected delete(): void {}

  onSelect({ selected }) {
    this.selectedCountries.splice(0, this.selectedCountries.length);
    this.selectedCountries.push(...selected);
  }

  onActivate(event) {}
}

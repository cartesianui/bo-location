import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListingControlsComponent } from '@cartesianui/common';
import { RequestCriteria } from '@cartesianui/ng-axis';
import { Subscription } from 'rxjs';
import { LocationSandbox } from '../../../location.sandbox';
import { Location, SearchLocationForm } from '../../../models';


@Component({
  selector: 'list-location',
  templateUrl: './list-location.component.html'
})
export class ListLocationComponent extends ListingControlsComponent<Location, SearchLocationForm> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dtContainer') dtContainer: ElementRef;

  subscriptions: Array<Subscription> = [];
  selectedLocations: Location[] = [];
  criteria = new RequestCriteria<SearchLocationForm>(new SearchLocationForm());
  searchModel = '';

  constructor(protected _sandbox: LocationSandbox, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.registerEvents();
  }

  ngAfterViewInit(): void {
    this.criteria.with('city,state,country');
    this.reloadTable();
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  search(): void {
    this.setPage(1);
    this.criteria.with('city,state,country');
    this.criteria.where('name', 'like', this.searchModel);
    this.list();
  }

  protected registerEvents() {
    this.subscriptions.push(
      this._sandbox.locationsData$.subscribe((data: Location[]) => {
        if (data) {
          this.data = Object.values(data);
        }
        this.ui.clearBusy();
        this.isTableLoading = false;
      })
    );
    this.subscriptions.push(
      this._sandbox.locationsMeta$.subscribe((meta: any) => {
        if (meta) {
          this.pagination = meta.pagination;
        }
      })
    );
  }

  protected list(): void {
    this.ui.setBusy(this.dtContainer.nativeElement);
    this.isTableLoading = true;
    this._sandbox.fetchLocations(this.criteria);
  }

  public delete(): void {
    let idArray = [];
    this.selectedLocations.forEach((data) => {
      idArray.push(data.id);
    });
    this.message.confirm(`Are you sure you want to delete location?`, 'Delete Location', (result) => {
      if (result) {
        this.notify.info('Deleting location');
        this._sandbox.deleteLocation(JSON.stringify(idArray));
        this._sandbox.fetchLocations(this.criteria);
      }
    });
  }

  onSelect({ selected }) {
    this.selectedLocations.splice(0, this.selectedLocations.length);
    this.selectedLocations.push(...selected);
  }

  onActivate(event) {}
}

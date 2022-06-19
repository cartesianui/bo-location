import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListingControlsComponent } from '@cartesianui/common';
import { RequestCriteria } from '@cartesianui/core';
import { Subscription } from 'rxjs';
import { LocationSandbox } from '../../../location.sandbox';
import { State, SearchStateForm } from '../../../models';

@Component({
  selector: 'list-state',
  templateUrl: './list-state.component.html'
})
export class ListStateComponent extends ListingControlsComponent<State, SearchStateForm> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dtContainer') dtContainer: ElementRef;

  subscriptions: Array<Subscription> = [];
  selectedStates: State[] = [];
  criteria = new RequestCriteria<SearchStateForm>(new SearchStateForm());
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
    this.criteria.form.country.value = this.searchModel;
    this.criteria.form.name.value = this.searchModel;
    this.list();
  }

  protected registerEvents() {
    this.subscriptions.push(
      this._sandbox.statesData$.subscribe((data: State[]) => {
        if (data) {
          this.data = Object.values(data);
        }
        this.ui.clearBusy();
        this.isTableLoading = false;
      })
    );
    this.subscriptions.push(
      this._sandbox.statesMeta$.subscribe((meta: any) => {
        if (meta) {
          this.pagination = meta.pagination;
        }
      })
    );
  }

  protected list(): void {
    this.ui.setBusy(this.dtContainer.nativeElement);
    this.isTableLoading = true;
    this._sandbox.fetchStates(this.criteria);
  }

  protected delete(): void {}

  onSelect({ selected }) {
    this.selectedStates.splice(0, this.selectedStates.length);
    this.selectedStates.push(...selected);
  }

  onActivate(event) {}
}

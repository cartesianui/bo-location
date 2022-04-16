import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RequestCriteria } from '@cartesianui/ng-axis';
import { BaseComponent } from '@cartesianui/common';
import { LocationSandbox } from '../../../location.sandbox';
import { State, City, Country, SearchCountryForm, SearchStateForm } from '../../../models';

@Component({
  selector: 'create-city',
  templateUrl: './create-city.component.html'
})
export class CreateCityComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('formCard') formCard: ElementRef;
  subscriptions: Subscription[] = [];

  countriesLoading: boolean;
  countriesLoaded: boolean;
  countriesFailed: boolean;
  countriesCriteria = new RequestCriteria<SearchCountryForm>(new SearchCountryForm()).limit(100000);

  statesLoading: boolean;
  statesLoaded: boolean;
  statesFailed: boolean;
  statesCriteria = new RequestCriteria<SearchStateForm>(new SearchStateForm()).limit(100000);

  countryList: Country[] = [];
  stateList: State[] = [];
  formGroup = new FormGroup({
    countryId: new FormControl(0, Validators.required),
    stateId: new FormControl(0, Validators.required),
    name: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required, this.formValidator.isFloatValidator(), Validators.min(-90), Validators.max(90)]),
    longitude: new FormControl('', [Validators.required, this.formValidator.isFloatValidator(), Validators.min(-180), Validators.max(180)])
  });

  loading: boolean;
  loaded: boolean;
  failed: boolean;

  constructor(protected injector: Injector, protected _sandbox: LocationSandbox) {
    super(injector);
  }

  ngOnInit(): void {
    this.initConfig();
  }

  ngAfterViewInit(): void {
    this.registerEvents();
    this._sandbox.fetchCountries(this.countriesCriteria);
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  getFormClasses(controlName: string): string {
    const control = this.formGroup.controls[controlName];
    return this.formValidator.getFormClasses(control);
  }

  initConfig(): void {}

  create(): void {
    if (this.formGroup.valid) {
      const form = new City({
        countryId: this.formGroup.controls.countryId.value,
        stateId: this.formGroup.controls.stateId.value,
        name: this.formGroup.controls.name.value,
        latitude: this.formGroup.controls.latitude.value,
        longitude: this.formGroup.controls.longitude.value
      });
      this._sandbox.createCity(form);
    }
  }

  searchState(event: any): void {
    const id = event.target.value;
    this.statesCriteria.where('country_id', '=', id);
    this._sandbox.fetchStates(this.statesCriteria);
  }

  registerEvents(): void {
    this.subscriptions.push(
      this._sandbox.countriesData$.subscribe((countries: Country[]) => {
        if (countries) {
          this.countryList = [];
          Object.values(countries).forEach((v) => {
            this.countryList.push(v);
          });
        }
      })
    );
    this.subscriptions.push(
      this._sandbox.countriesLoading$.subscribe((loading) => {
        if (loading) {
          this.ui.setBusy(this.formCard.nativeElement);
        }
        this.countriesLoading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.countriesLoaded$.subscribe((loaded) => {
        if (loaded) {
          this.ui.clearBusy(this.formCard.nativeElement);
        }
        this.countriesLoaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.countriesFailed$.subscribe((failed) => {
        if (failed) {
          this.ui.clearBusy(this.formCard.nativeElement);
        }
        this.countriesFailed = failed;
      })
    );
    this.subscriptions.push(
      this._sandbox.statesData$.subscribe((states: State[]) => {
        if (states) {
          this.stateList = [];
          Object.values(states).forEach((v) => {
            this.stateList.push(v);
          });
        }
      })
    );
    this.subscriptions.push(
      this._sandbox.statesLoading$.subscribe((loading) => {
        if (loading) {
          this.ui.setBusy(this.formCard.nativeElement);
        }
        this.statesLoading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.statesLoaded$.subscribe((loaded) => {
        if (loaded) {
          this.ui.clearBusy(this.formCard.nativeElement);
        }
        this.statesLoaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.statesFailed$.subscribe((failed) => {
        if (failed) {
          this.ui.clearBusy(this.formCard.nativeElement);
        }
        this.statesFailed = failed;
      })
    );
    this.subscriptions.push(
      this._sandbox.cityLoading$.subscribe((loading) => {
        if (loading && this.loading !== undefined) {
          this.notify.info('Creating city');
        }
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.cityLoaded$.subscribe((loaded) => {
        if (loaded && this.loaded !== undefined) {
          this.notify.success('City created', 'Success!');
        }
        this.loaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.cityFailed$.subscribe((failed) => {
        if (failed && this.failed !== undefined) {
          this.notify.error('Could not create city', 'Error!');
        }
        this.failed = failed;
      })
    );
  }
}

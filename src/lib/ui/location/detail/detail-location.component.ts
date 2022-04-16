import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '@cartesianui/common';
import { RequestCriteria } from '@cartesianui/ng-axis';
import { FormControl, FormGroup } from '@angular/forms';
import { LocationSandbox } from '../../../location.sandbox';
import { State, City, Country, Location, SearchCountryForm, SearchStateForm, SearchCityForm } from '../../../models';

@Component({
  selector: 'detail-location',
  templateUrl: './detail-location.component.html'
})
export class DetailLocationComponent extends BaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('formCard') formCard: ElementRef;

  subscriptions: Array<Subscription> = [];
  location: Location;
  loaded: boolean;
  loading: boolean;
  failed: boolean;
  deleting: boolean;

  countriesLoading: boolean;
  countriesLoaded: boolean;
  countriesFailed: boolean;
  countriesCriteria = new RequestCriteria<SearchCountryForm>(new SearchCountryForm()).limit(100000);

  statesLoading: boolean;
  statesLoaded: boolean;
  statesFailed: boolean;
  statesCriteria = new RequestCriteria<SearchStateForm>(new SearchStateForm()).limit(100000);

  citiesLoading: boolean;
  citiesLoaded: boolean;
  citiesFailed: boolean;
  citiesCriteria = new RequestCriteria<SearchCityForm>(new SearchCityForm()).limit(100000);
  countryList: Country[] = [];
  stateList: State[] = [];
  cityList: City[] = [];
  formGroup = new FormGroup({
    countryId: new FormControl(0, Validators.required),
    stateId: new FormControl(0, Validators.required),
    cityId: new FormControl(0, Validators.required),
    postCode: new FormControl('', [Validators.required]),
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required, this.formValidator.isFloatValidator(), Validators.min(-90), Validators.max(90)]),
    longitude: new FormControl('', [Validators.required, this.formValidator.isFloatValidator(), Validators.min(-180), Validators.max(180)])
  });

  constructor(injector: Injector, private _sandbox: LocationSandbox, private route: ActivatedRoute, private router: Router) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.registerEvents();
    //this._sandbox.fetchCountries(this.countriesCriteria);
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  searchState(event: any): void {
    const id = event.target.value;
    this.statesCriteria.where('country_id', '=', id);
    this.stateList = [];
    this.formGroup.controls.stateId.setValue(0);
    this.cityList = [];
    this.formGroup.controls.cityId.setValue(0);
    this._sandbox.fetchStates(this.statesCriteria);
  }

  searchCity(event: any): void {
    const id = event.target.value;
    this.citiesCriteria.where('state_id', '=', id);
    this.cityList = [];
    this.formGroup.controls.cityId.setValue(0);
    this._sandbox.fetchCities(this.citiesCriteria);
  }

  delete(): void {
    this.message.confirm(`Are you sure you want to delete location ${this.location.id}?`, 'Delete Location', (result) => {
      if (result) {
        this.notify.info('Deleting location');
        this.deleting = true;
        this._sandbox.deleteLocation(this.location.id);
      }
    });
  }

  save(): void {
    if (this.loading) {
      this.notify.warn('Please wait for the previous request');
      return;
    }
    if (this.formGroup.valid) {
      const form = new Location({
        id: this.location.id,
        addressLine1: this.formGroup.controls.addressLine1.value,
        addressLine2: this.formGroup.controls.addressLine2.value,
        countryId: this.formGroup.controls.countryId.value,
        stateId: this.formGroup.controls.stateId.value,
        cityId: this.formGroup.controls.cityId.value,
        postCode: this.formGroup.controls.postCode.value,
        latitude: this.formGroup.controls.latitude.value,
        longitude: this.formGroup.controls.longitude.value
      });
      this._sandbox.updateLocation(form);
    } else {
      this.notify.warn('Invalid form data');
    }
  }

  registerEvents(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const id = params.id;
        this._sandbox.fetchLocation(id);
      })
    );
    this.subscriptions.push(
      this._sandbox.locationLoading$.subscribe((loading: boolean) => {
        if (loading) {
          this.ui.setBusy(this.formCard.nativeElement);
        }
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.locationLoaded$.subscribe((loaded: boolean) => {
        if (loaded) {
          this.ui.clearBusy(this.formCard.nativeElement);
          if (this.deleting) {
            this.notify.success('Location delete successfully', 'Success!');
            this.router.navigate(['locations', 'locations']);
          }
        }
        this.loaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.location$.subscribe((location: any) => {
        if (this.loaded) {
          this.loading = false;
          this.location = location;
          this._sandbox.fetchCountries(this.countriesCriteria);
          this.statesCriteria.where('country_id', '=', location.countryId);
          this._sandbox.fetchStates(this.statesCriteria);
          this.citiesCriteria.where('state_id', '=', location.stateId);
          this._sandbox.fetchCities(this.citiesCriteria);
          this.formGroup.patchValue(this.location);
        }
      })
    );
    this.subscriptions.push(
      this._sandbox.locationFailed$.subscribe((failed: boolean) => {
        if (failed) {
          this.ui.clearBusy(this.formCard.nativeElement);
          if (this.deleting) {
            this.notify.error('Could not delete location', 'Error!');
            this.deleting = false;
          }
        }
        this.failed = failed;
      })
    );
    this.subscriptions.push(
      this._sandbox.countriesData$.subscribe((countries: Country[]) => {
        if (countries) {
          if (this.countryList.length == 0) {
            this.countryList = [];
            Object.values(countries).forEach((v) => {
              this.countryList.push(v);
            });
          }
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
          if (this.stateList.length == 0) {
            this.stateList = [];
            Object.values(states).forEach((v) => {
              this.stateList.push(v);
            });
          }
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
      this._sandbox.citiesData$.subscribe((cities: City[]) => {
        if (cities) {
          if (this.cityList.length == 0) {
            this.cityList = [];
            Object.values(cities).forEach((v) => {
              this.cityList.push(v);
            });
          }
        }
      })
    );
    this.subscriptions.push(
      this._sandbox.citiesLoading$.subscribe((loading) => {
        if (loading) {
          this.ui.setBusy(this.formCard.nativeElement);
        }
        this.citiesLoading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.citiesLoaded$.subscribe((loaded) => {
        if (loaded) {
          this.ui.clearBusy(this.formCard.nativeElement);
        }
        this.citiesLoaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.citiesFailed$.subscribe((failed) => {
        if (failed) {
          this.ui.clearBusy(this.formCard.nativeElement);
        }
        this.citiesFailed = failed;
      })
    );
  }

  getFormClasses(controlName: string): string {
    const control = this.formGroup.controls[controlName];
    return this.formValidator.getFormClasses(control);
  }
}

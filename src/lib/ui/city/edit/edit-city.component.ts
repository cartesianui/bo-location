import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestCriteria } from '@cartesianui/ng-axis';
import { BaseComponent } from '@cartesianui/common';
import { LocationSandbox } from '../../../location.sandbox';
import { State, City, Country, SearchCountryForm, SearchStateForm } from '../../../models';

@Component({
  selector: 'edit-city',
  templateUrl: './edit-city.component.html'
})
export class EditCityComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('formCard') formCard: ElementRef;

  subscriptions: Array<Subscription> = [];

  city: City;
  loaded: boolean;
  loading: boolean;
  failed: boolean;
  deleting = false;

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

  constructor(injector: Injector, private _sandbox: LocationSandbox, private route: ActivatedRoute, private router: Router) {
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

  initConfig(): void {}

  searchState(event: any): void {
    const id = event.target.value;
    this.statesCriteria.where('country_id', '=', id);
    this._sandbox.fetchStates(this.statesCriteria);
  }

  getFormClasses(controlName: string): string {
    const control = this.formGroup.controls[controlName];
    return this.formValidator.getFormClasses(control);
  }

  save(): void {
    if (this.loading) {
      this.notify.warn('Please wait for previous request', 'Warning!');
      return;
    }
    if (this.formGroup.valid) {
      const form = new City({
        id: this.city.id,
        countryId: this.formGroup.controls.countryId.value,
        stateId: this.formGroup.controls.stateId.value,
        name: this.formGroup.controls.name.value,
        latitude: this.formGroup.controls.latitude.value,
        longitude: this.formGroup.controls.longitude.value
      });
      this._sandbox.updateCity(form);
    } else {
      this.notify.warn('Invalid form data', 'Warning!');
    }
  }

  delete(): void {
    this.message.confirm(`Are you sure you want to delete city ${this.city.name}?`, 'Delete City', (result) => {
      if (result) {
        this.notify.info('Deleting city');
        this.deleting = true;
        this._sandbox.deleteCity(this.city.id);
      }
    });
  }

  registerEvents(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const id = params.id;
        this._sandbox.fetchCity(id);
      })
    );
    this.subscriptions.push(
      this._sandbox.cityLoading$.subscribe((loading: boolean) => {
        if (loading) {
          this.ui.setBusy(this.formCard.nativeElement);
        }
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.cityLoaded$.subscribe((loaded: boolean) => {
        if (loaded) {
          this.ui.clearBusy(this.formCard.nativeElement);
          if (this.deleting) {
            this.notify.success('City deleted', 'Success!');
            this.router.navigate(['locations', 'cities']);
          }
        }
        this.loaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.cityFailed$.subscribe((failed: boolean) => {
        if (failed) {
          this.ui.clearBusy(this.formCard.nativeElement);
          if (this.deleting) {
            this.notify.success('Could not delete city', 'Error!');
            this.deleting = false;
          }
        }
        this.failed = failed;
      })
    );
    this.subscriptions.push(
      this._sandbox.city$.subscribe((city: City) => {
        this.city = city;
        this.formGroup.patchValue(this.city);
        this.statesCriteria.where('country_id', '=', this.formGroup.controls.countryId.value);
        this._sandbox.fetchStates(this.statesCriteria);
      })
    );
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
  }
}

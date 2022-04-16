import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseComponent } from '@cartesianui/common';
import { RequestCriteria } from '@cartesianui/ng-axis';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { LocationSandbox } from '../../../location.sandbox';
import { State, Country, SearchCountryForm } from '../../../models';

@Component({
  selector: 'create-state',
  templateUrl: './create-state.component.html'
})
export class CreateStateComponent extends BaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('formCard') formCard: ElementRef;
  subscriptions: Subscription[] = [];

  loading: boolean;
  loaded: boolean;
  failed: boolean;

  countriesLoading: boolean;
  countriesLoaded: boolean;
  countriesFailed: boolean;
  countriesCriteria = new RequestCriteria<SearchCountryForm>(new SearchCountryForm()).limit(100000);
  countryList: Country[] = [];

  formGroup = new FormGroup({
    countryId: new FormControl(0, Validators.required),
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required])
  });

  constructor(injector: Injector, protected _sandbox: LocationSandbox) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.registerEvents();
    this._sandbox.fetchCountries(this.countriesCriteria);
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  create(): void {
    if (this.loading) {
      return;
    }
    if (this.formGroup.valid) {
      const form = new State({
        countryId: this.formGroup.controls.countryId.value,
        name: this.formGroup.controls.name.value,
        code: this.formGroup.controls.code.value
      });
      this._sandbox.createState(form);
    }
  }

  registerEvents(): void {
    this.subscriptions.push(
      this._sandbox.countriesData$.subscribe((c: Country[]) => {
        if (c) {
          Object.values(c).forEach((v) => {
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
      this._sandbox.stateLoading$.subscribe((loading) => {
        if (loading && this.loading !== undefined) {
          this.notify.info('Creating state');
        }
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.stateLoaded$.subscribe((loaded) => {
        if (loaded && this.loaded !== undefined) {
          this.notify.success('State created', 'Success!');
        }
        this.loaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.stateFailed$.subscribe((failed) => {
        if (failed && this.failed !== undefined) {
          this.notify.error('Could not create state', 'Error!');
        }
        this.failed = failed;
      })
    );
  }

  getFormClasses(controlName: string): string {
    const control = this.formGroup.controls[controlName];
    return this.formValidator.getFormClasses(control);
  }

  setCountryValidators(): void {
    // if (this.config[0].options) {
    //   const countryIds = this.config[0].options.map((c) => c.value.toString());
    //   this.config[0].validators = [
    //     Validators.required,
    //     this.formValidator.inValidator(countryIds),
    //   ];
    // }
  }
}

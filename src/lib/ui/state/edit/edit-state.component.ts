import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@cartesianui/common';
import { RequestCriteria } from '@cartesianui/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { LocationSandbox } from '../../../location.sandbox';
import { State, Country, SearchCountryForm } from '../../../models';

@Component({
  selector: 'edit-state',
  templateUrl: './edit-state.component.html'
})
export class EditStateComponent extends BaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('formCard') formCard: ElementRef;
  countryList: Country[] = [];

  formGroup = new FormGroup({
    countryId: new FormControl(0, Validators.required),
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required])
  });

  subscriptions: Array<Subscription> = [];
  state: State;
  loaded: boolean;
  loading: boolean;
  failed: boolean;
  deleting: boolean;

  countries: Country[] = [];
  countriesLoading: boolean;
  countriesLoaded: boolean;
  countriesFailed: boolean;

  countriesCriteria = new RequestCriteria<SearchCountryForm>(new SearchCountryForm()).limit(100000);

  constructor(injector: Injector, private _sandbox: LocationSandbox, private route: ActivatedRoute, private router: Router) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.registerEvents();
    this._sandbox.fetchCountries(this.countriesCriteria);
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  delete(): void {
    this.message.confirm(`Are you sure you want to delete country ${this.state.name}?`, 'Delete State', (result) => {
      if (result) {
        this._sandbox.deleteState(this.state.id);
      }
    });
  }

  save(): void {
    if (this.loading) {
      return;
    }
    if (this.formGroup.valid) {
      const form = new State({
        id: this.state.id,
        countryId: this.formGroup.controls.countryId.value,
        name: this.formGroup.controls.name.value,
        code: this.formGroup.controls.code.value
      });
      this._sandbox.updateState(form);
    } else {
      this.notify.warn('Invalid form data', 'Warning!');
    }
  }

  getFormClasses(controlName: string): string {
    const control = this.formGroup.controls[controlName];
    return this.formValidator.getFormClasses(control);
  }

  registerEvents(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const id = params.id;
        this._sandbox.fetchState(id);
      })
    );
    this.subscriptions.push(
      this._sandbox.stateLoading$.subscribe((loading) => {
        if (loading) {
          this.ui.setBusy(this.formCard.nativeElement);
        }
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.stateLoaded$.subscribe((loaded) => {
        if (loaded) {
          this.ui.clearBusy(this.formCard.nativeElement);
          if (this.deleting) {
            this.notify.success('State deleted', 'Success!');
            this.router.navigate(['locations', 'states']);
          }
        }
        this.loaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.stateFailed$.subscribe((failed) => {
        if (failed) {
          this.ui.clearBusy(this.formCard.nativeElement);
          if (this.deleting) {
            this.notify.error('Could not delete state', 'Error!');
            this.deleting = false;
          }
        }
        this.failed = failed;
      })
    );
    this.subscriptions.push(
      this._sandbox.state$.subscribe((state: State) => {
        this.state = state;
        this.formGroup.patchValue(this.state);
      })
    );
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
  }

  // setCountryValidators(): void {
  //   if (this.config[0].options) {
  //     const countryIds = this.config[0].options.map((c) => c.value.toString());
  //     this.config[0].validators = [
  //       Validators.required,
  //       this.formValidator.inValidator(countryIds),
  //     ];
  //   }
  // }
}

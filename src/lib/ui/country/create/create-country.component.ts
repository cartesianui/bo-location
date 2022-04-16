import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@cartesianui/common';
import { LocationSandbox } from '../../../location.sandbox';
import { Country } from '../../../models';

@Component({
  selector: 'create-country',
  templateUrl: './create-country.component.html'
})
export class CreateCountryComponent extends BaseComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    native: new FormControl('', [Validators.required]),
    alpha2: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{2}')]),
    alpha3: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{3}')]),
    isd: new FormControl('', [Validators.required]),
    capital: new FormControl('', [Validators.required]),
    currency: new FormControl('', [Validators.required]),
    continent: new FormControl('', [Validators.required]),
    subcontinent: new FormControl('', [Validators.required]),
    emoji: new FormControl('', [Validators.required]),
    emojiUnicode: new FormControl('', [Validators.required, this.formValidator.unicodeValidator()])
  });

  loading: boolean;
  loaded: boolean;
  failed: boolean;

  constructor(injector: Injector, private _sandbox: LocationSandbox) {
    super(injector);
  }

  ngOnInit(): void {
    this.registerEvents();
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  create(): void {
    if (this.formGroup.valid) {
      const form = new Country({
        name: this.formGroup.controls.name.value,
        native: this.formGroup.controls.native.value,
        alpha2: this.formGroup.controls.alpha2.value,
        alpha3: this.formGroup.controls.alpha3.value,
        isd: this.formGroup.controls.isd.value,
        capital: this.formGroup.controls.capital.value,
        currency: this.formGroup.controls.currency.value,
        continent: this.formGroup.controls.continent.value,
        subcontinent: this.formGroup.controls.subcontinent.value,
        emoji: this.formGroup.controls.emoji.value,
        emojiUnicode: this.formGroup.controls.emojiUnicode.value
      });
      this._sandbox.createCountry(form);
    } else {
      this.notify.warn('Invalid data', 'Warning!');
    }
  }

  registerEvents() {
    this.subscriptions.push(
      this._sandbox.countryLoading$.subscribe((loading) => {
        if (loading && this.loading !== undefined) {
          this.notify.info('Creating country');
        }
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.countryLoaded$.subscribe((loaded) => {
        if (loaded && this.loaded !== undefined) {
          this.message.success('Country created', 'Success!');
        }
        this.loaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.countryFailed$.subscribe((failed) => {
        if (failed && this.failed !== undefined) {
          this.message.error('Could not create country', 'Error!');
        }
        this.failed = failed;
      })
    );
  }

  getFormClasses(controlName: string): string {
    const control = this.formGroup.controls[controlName];
    return this.formValidator.getFormClasses(control);
  }
}

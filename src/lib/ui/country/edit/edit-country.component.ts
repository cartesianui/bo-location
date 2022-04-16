import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '@cartesianui/common';
import { LocationSandbox } from '../../../location.sandbox';
import { Country } from '../../../models';

@Component({
  selector: 'edit-country',
  templateUrl: './edit-country.component.html'
})
export class EditCountryComponent extends BaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('detailCard') detailCard: ElementRef;

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
  subscriptions: Array<Subscription> = [];
  country: Country;
  loaded: boolean;
  loading: boolean;
  failed: boolean;
  deleting = false;

  constructor(injector: Injector, private _sandbox: LocationSandbox, private route: ActivatedRoute, private router: Router) {
    super(injector);
    this.country = new Country();
  }

  ngAfterViewInit(): void {
    this.registerEvents();
  }

  ngOnDestroy() {
    this.unregisterEvents();
  }

  delete(): void {
    this.message.confirm(`Are you sure you want to delete country ${this.country.name}?`, 'Delete Country', (result) => {
      if (result) {
        this.notify.info('Deleting country');
        this.deleting = true;
        this._sandbox.deleteCountry(this.country.id);
      }
    });
  }

  save(): void {
    if (this.formGroup.valid) {
      const form = new Country({
        id: this.country.id,
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
      this._sandbox.updateCountry(form);
    }
  }

  registerEvents(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const id = params.id;
        this._sandbox.fetchCountry(id);
      })
    );
    this.subscriptions.push(
      this._sandbox.countryLoading$.subscribe((loading: boolean) => {
        if (loading) {
          this.ui.setBusy(this.detailCard.nativeElement);
        }
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this._sandbox.countryLoaded$.subscribe((loaded: boolean) => {
        if (loaded) {
          this.ui.clearBusy(this.detailCard.nativeElement);
          if (this.deleting) {
            this.notify.success('Country deleted', 'Success!');
            this.router.navigate(['locations', 'countries']);
          }
        }
        this.loaded = loaded;
      })
    );
    this.subscriptions.push(
      this._sandbox.countryFailed$.subscribe((failed: boolean) => {
        if (failed) {
          this.ui.clearBusy(this.detailCard.nativeElement);
          if (this.deleting) {
            this.notify.success('Could not delete country', 'Error!');
          }
        }
        this.failed = failed;
      })
    );
    this.subscriptions.push(
      this._sandbox.country$.subscribe((country: Country) => {
        this.country = country;
        this.formGroup.patchValue(this.country);
      })
    );
  }

  getFormClasses(controlName: string): string {
    const control = this.formGroup.controls[controlName];
    return this.formValidator.getFormClasses(control);
  }
}

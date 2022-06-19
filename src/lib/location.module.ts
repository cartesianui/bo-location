import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';
import { ListCitiesComponent } from './ui/city/list/list-cities.component';
import { LocationRoutingModule } from './location-routing.module';
import { LocationSandbox } from './location.sandbox';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LocationEffects, locationFeatureKey, locationReducers } from './store';
import { LocationHttpService } from './shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCityComponent } from './ui/city/create/create-city.component';
import { ListLocationComponent } from './ui/location/list/list-location.component';
import { CreateLocationComponent } from './ui/location/create/create-location.component';
import { ListCountryComponent } from './ui/country/list/list-country.component';
import { CreateCountryComponent } from './ui/country/create/create-country.component';
import { ListStateComponent } from './ui/state/list/list-state.component';
import { CreateStateComponent } from './ui/state/create/create-state.component';
import { EditCityComponent } from './ui/city/edit/edit-city.component';
import { EditCountryComponent } from './ui/country/edit/edit-country.component';
import { DetailLocationComponent } from './ui/location/detail/detail-location.component';
import { EditStateComponent } from './ui/state/edit/edit-state.component';
import { FormsModule as CartesianFormsMoudle } from '@cartesianui/forms';

@NgModule({
  declarations: [
    LocationComponent,
    ListCitiesComponent,
    CreateCityComponent,
    ListLocationComponent,
    CreateLocationComponent,
    ListCountryComponent,
    CreateCountryComponent,
    ListStateComponent,
    CreateStateComponent,
    EditCityComponent,
    EditCountryComponent,
    DetailLocationComponent,
    EditStateComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    StoreModule.forFeature(locationFeatureKey, locationReducers),
    EffectsModule.forFeature([LocationEffects]),
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    CartesianFormsMoudle
  ],
  providers: [LocationHttpService, LocationSandbox]
})
export class LocationModule {}

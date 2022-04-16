import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationComponent } from './location.component';
import { CreateCityComponent } from './ui/city/create/create-city.component';
import { EditCityComponent } from './ui/city/edit/edit-city.component';
import { ListCitiesComponent } from './ui/city/list/list-cities.component';
import { CreateCountryComponent } from './ui/country/create/create-country.component';
import { EditCountryComponent } from './ui/country/edit/edit-country.component';
import { ListCountryComponent } from './ui/country/list/list-country.component';
import { CreateLocationComponent } from './ui/location/create/create-location.component';
import { DetailLocationComponent } from './ui/location/detail/detail-location.component';
import { ListLocationComponent } from './ui/location/list/list-location.component';
import { CreateStateComponent } from './ui/state/create/create-state.component';
import { EditStateComponent } from './ui/state/edit/edit-state.component';
import { ListStateComponent } from './ui/state/list/list-state.component';

const routes: Routes = [
  {
    path: '',
    component: LocationComponent,
    data: {},
    children: [
      {
        path: 'locations',
        data: {
          title: ''
        },
        children: [
          {
            path: '',
            component: ListLocationComponent,
            data: { title: 'Locations' }
          },
          {
            path: 'create',
            component: CreateLocationComponent,
            data: { title: 'Create Location' }
          },
          {
            path: ':id',
            component: DetailLocationComponent,
            data: { title: 'Location Detail' }
          }
        ]
      },
      {
        path: 'cities',
        data: {
          title: 'Cities'
        },
        children: [
          {
            path: '',
            component: ListCitiesComponent,
            data: { title: 'Cities' }
          },
          {
            path: 'create',
            component: CreateCityComponent,
            data: { title: 'Create City' }
          },
          {
            path: ':id',
            component: EditCityComponent,
            data: { title: 'City Detail' }
          }
        ]
      },
      {
        path: 'countries',
        data: {
          title: 'Countries'
        },
        children: [
          {
            path: '',
            component: ListCountryComponent,
            data: { title: 'Countries' }
          },
          {
            path: 'create',
            component: CreateCountryComponent,
            data: { title: 'Create Country' }
          },
          {
            path: ':id',
            component: EditCountryComponent,
            data: { title: 'Country Detail' }
          }
        ]
      },
      {
        path: 'states',
        data: {
          title: 'States'
        },
        children: [
          {
            path: '',
            component: ListStateComponent,
            data: { title: 'States' }
          },
          {
            path: 'create',
            component: CreateStateComponent,
            data: { title: 'Create State' }
          },
          {
            path: ':id',
            component: EditStateComponent,
            data: { title: 'State Detail' }
          }
        ]
      },
      {
        path: '',
        redirectTo: 'locations'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule {}

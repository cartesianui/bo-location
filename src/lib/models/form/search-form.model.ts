import { Injectable } from '@angular/core';
import { WhereItem } from '@cartesianui/ng-axis';

@Injectable()
export class SearchCityForm {
  name: WhereItem = { column: 'name', operator: '=', value: null };
  code: WhereItem = { column: 'code', operator: '=', value: null };
}

@Injectable()
export class SearchCountryForm {
  name: WhereItem = { column: 'name', operator: '=', value: null };
  code: WhereItem = { column: 'code', operator: '=', value: null };
  capital: WhereItem = { column: 'capital', operator: '=', value: null };
}

@Injectable()
export class SearchLocationForm {
  addressLine1: WhereItem = {
    column: 'addressLine1',
    operator: '=',
    value: null
  };
  addressLine2: WhereItem = {
    column: 'addressLine2',
    operator: '=',
    value: null
  };
  postCode: WhereItem = { column: 'postCode', operator: '=', value: null };
}

@Injectable()
export class SearchStateForm {
  name: WhereItem = { column: 'name', operator: 'like', value: null };
  code: WhereItem = { column: 'code', operator: '=', value: null };
  country: WhereItem = {
    column: 'country.name',
    operator: 'like',
    value: null
  };
}

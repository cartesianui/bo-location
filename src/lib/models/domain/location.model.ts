import { ParentModel } from '@cartesianui/common';
import { IState, ICountry, ICity } from './index';

export interface ILocation {
  id?: string;
  locatableType?: string;
  locatableId?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  country?: { data: ICountry };
  state?: { data: IState };
  city?: { data: ICity };
  addressLine1: string;
  addressLine2: string;
  postCode: string;
  latitude: string;
  longitude: string;
}

export class Location extends ParentModel implements ILocation {
  public id: string;
  public name: string;
  public addressLine1: string;
  public addressLine2: string;
  public postCode: string;
  public latitude: string;
  public longitude: string;
  public createdAt: string;
  public updatedAt: string;
  public realId: string;
  public country: { data: ICountry };
  public state: { data: IState };
  public city: { data: ICity };

  constructor(data?: ILocation) {
    super(data);
  }
}

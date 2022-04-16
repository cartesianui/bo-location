import { ParentModel } from '@cartesianui/common';

export interface ICity {
  id?: string | undefined;
  countryId: string;
  stateId: string;
  name: string;
  latitude: string;
  longitude: string;
}

export class City extends ParentModel implements ICity {
  public countryId: string;
  public stateId: string;
  public id: string;
  public name: string;
  public latitude: string;
  public longitude: string;

  constructor(data?: ICity) {
    super(data);
  }
}

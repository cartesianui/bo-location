import { ParentModel } from '@cartesianui/common';

export interface ICountry {
  id?: string | undefined;
  code?: string;
  name: string;
  native: string;
  alpha2: string;
  alpha3: string;
  isd: string;
  capital: string;
  currency: string;
  continent: string;
  subcontinent: string;
  emoji: string;
  emojiUnicode: string;
}

export class Country extends ParentModel implements ICountry {
  public id: string;
  public name: string;
  public code: string;
  public native: string;
  public alpha2: string;
  public alpha3: string;
  public isd: string;
  public capital: string;
  public currency: string;
  public continent: string;
  public subcontinent: string;
  public emoji: string;
  public emojiUnicode: string;

  constructor(data?: ICountry) {
    super(data);
  }
}

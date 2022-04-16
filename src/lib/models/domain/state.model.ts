import { ParentModel } from '@cartesianui/common';

export interface IState {
  id?: string | undefined;
  countryId: string;
  name: string;
  code: string;
}

export class State extends ParentModel implements IState {
  public countryId: string;
  public id: string;
  public name: string;
  public code: string;

  constructor(data?: IState) {
    super(data);
  }
}

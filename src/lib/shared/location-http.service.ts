import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, POST, GET, Body, Criteria, DefaultHeaders, Adapter, RequestCriteria, Path, DELETE, PUT } from '@cartesianui/core';
import { SearchCityForm, SearchCountryForm, SearchLocationForm, SearchStateForm } from '../models/form/';
import { City, State, Country, Location } from '../models/domain/';

@Injectable()
@DefaultHeaders({
  Accept: 'application/json',
  'Content-Type': 'application/json'
})
export class LocationHttpService extends HttpService {
  /**
   * Fetch cities list
   *
   * @param SearchForm form to filter api response
   */
  @GET('/cities')
  public fetchCities(@Criteria criteria: RequestCriteria<SearchCityForm>): Observable<any> {
    return null;
  }

  /**
   * Fetch city
   *
   * @param id Id of city to fetch
   */
  @GET('/cities/{id}')
  public fetchCity(@Path('id') id: string): Observable<any> {
    return null;
  }

  /**
   * Create city
   *
   * @param form form containing data of city
   */
  @POST('/cities')
  public createCity(@Body form: City): Observable<any> {
    return null;
  }

  /**
   * Update city
   *
   * @param form form containing data of city
   */
  @PUT('/cities/{id}')
  public updateCity(@Path('id') id: string, @Body form: City): Observable<any> {
    return null;
  }

  /**
   * Delete city
   *
   * @param id Id of city to delete
   */
  @DELETE('/cities/{id}')
  public deleteCity(@Path('id') id: string): Observable<any> {
    return null;
  }

  /**
   * Fetch countries list
   *
   * @param SearchForm form to filter api response
   */
  @GET('/countries')
  public fetchCountries(@Criteria criteria: RequestCriteria<SearchCountryForm>): Observable<any> {
    return null;
  }

  /**
   * Fetch country
   *
   * @param id Id of country to fetch
   */
  @GET('/countries/{id}')
  public fetchCountry(@Path('id') id: string): Observable<any> {
    return null;
  }

  /**
   * Create country
   *
   * @param form form containing data of country
   */
  @POST('/countries')
  public createCountry(@Body form: Country): Observable<any> {
    return null;
  }

  /**
   * Update country
   *
   * @param form form containing data of country
   */
  @PUT('/countries/{id}')
  public updateCountry(@Path('id') id: string, @Body form: Country): Observable<any> {
    return null;
  }

  /**
   * Delete country
   *
   * @param id Id of country to delete
   */
  @DELETE('/countries/{id}')
  public deleteCountry(@Path('id') id: string): Observable<any> {
    return null;
  }

  /**
   * Fetch locations list
   *
   * @param SearchForm form to filter api response
   */
  @GET('/locations')
  public fetchLocations(@Criteria criteria: RequestCriteria<SearchLocationForm>): Observable<any> {
    return null;
  }

  /**
   * Fetch location
   *
   * @param id Id of location to fetch
   */
  @GET('/locations/{id}')
  public fetchLocation(@Path('id') id: string): Observable<any> {
    return null;
  }

  /**
   * Create location
   *
   * @param form form containing data of location
   */
  @POST('/locations')
  public createLocation(@Body form: Location): Observable<any> {
    return null;
  }

  /**
   * Update location
   *
   * @param form form containing data of location
   */
  @PUT('/locations/{id}')
  public updateLocation(@Path('id') id: string, @Body form: Location): Observable<any> {
    return null;
  }

  /**
   * Delete location
   *
   * @param id Id of location to delete
   */
  @DELETE('/locations/{id}')
  public deleteLocation(@Path('id') id: string): Observable<any> {
    return null;
  }

  /**
   * Fetch states list
   *
   * @param SearchForm form to filter api response
   */
  @GET('/states')
  public fetchStates(@Criteria criteria: RequestCriteria<SearchStateForm>): Observable<any> {
    return null;
  }

  /**
   * Fetch state
   *
   * @param id Id of state to fetch
   */
  @GET('/states/{id}')
  public fetchState(@Path('id') id: string): Observable<any> {
    return null;
  }

  /**
   * Create state
   *
   * @param form form containing data of state
   */
  @POST('/states')
  public createState(@Body form: State): Observable<any> {
    return null;
  }

  /**
   * Update state
   *
   * @param form form containing data of state
   */
  @PUT('/states/{id}')
  public updateState(@Path('id') id: string, @Body form: State): Observable<any> {
    return null;
  }

  /**
   * Delete state
   *
   * @param id Id of state to Delete
   */
  @DELETE('/states/{id}')
  public deleteState(@Path('id') id: string): Observable<any> {
    return null;
  }
}

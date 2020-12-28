import { useEffect } from 'react';
import { connect } from 'react-redux';
import { MainPage } from '@pages';
import { Loader } from '@components';
import { loadCountries, loadCovidInfo, loadGlobalCovidData } from '@store';
import { IAppState, IAppComponentProps, ICountry } from '@types';
import './App.css';

function AppComponent({
  isCountriesLoaded,
  isCovidLoaded,
  isGlobalCovidDataLoaded,
  countries,
  loadCountries,
  loadCovidInfo,
  loadGlobalCovidData,
}: IAppComponentProps) {
  useEffect(() => {
    if (!isCountriesLoaded) {
      loadCountries();
    }
  }, [isCountriesLoaded, loadCountries]);

  useEffect(() => {
    if (isCountriesLoaded && !isCovidLoaded) {
      loadCovidInfo(countries);
    }
  }, [isCountriesLoaded, isCovidLoaded, countries, loadCovidInfo]);

  useEffect(() => {
    if (isCovidLoaded && !isGlobalCovidDataLoaded) {
      loadGlobalCovidData(countries);
    }
  }, [isCovidLoaded, isGlobalCovidDataLoaded, countries, loadGlobalCovidData]);

  return isCountriesLoaded && isCovidLoaded ? <MainPage /> : <Loader />;
}

const mapStateToProps = (state: IAppState) => ({
  isCountriesLoaded: state.isCountriesLoaded,
  isCovidLoaded: state.isCovidLoaded,
  isGlobalCovidDataLoaded: state.isGlobalCovidDataLoaded,
  countries: state.countries,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadCountries: () => dispatch(loadCountries()),
  loadCovidInfo: (countries: Array<ICountry>) => dispatch(loadCovidInfo(countries)),
  loadGlobalCovidData: (countries: Array<ICountry>) => dispatch(loadGlobalCovidData(countries)),
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

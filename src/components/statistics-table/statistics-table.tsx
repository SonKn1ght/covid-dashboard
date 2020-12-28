import { NoData } from '@components';
import { IAppState } from '@types';
import { getOnCurrentOptionsChart } from '@utils';
import * as React from 'react';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import './statistics-table.css';
import Table from './table';
import { useRef } from 'react';
import { setFullScreenElementValue } from '@store';
import { useDispatch } from 'react-redux';
import { FullScreenMode } from '../full-screen-mode';

export const StatsTable = () => {
  const selectedCountry = useSelector((state: IAppState) => state.selectedCountry);
  const selectedData = useSelector((state: IAppState) => state.selectedData);
  const countries = useSelector((state: IAppState) => state.countries);
  const isCountryCovidDataFailed = useSelector(
    (state: IAppState) => state.isCountryCovidDataFailed
  );
  const isCountryCovidDataLoaded = useSelector(
    (state: IAppState) => state.isCountryCovidDataLoaded
  );
  const selectedOptions = useSelector((state: IAppState) => state.selectedOptions);

  const optionCond = {
    isNew: false,
    isPer100: false,
  };

  const option = getOnCurrentOptionsChart(selectedOptions);
  if (option.includes('New')) {
    optionCond.isNew = true;
  }

  if (option.includes('100')) {
    optionCond.isPer100 = true;
  }

  function getKeys(optionCond: any) {
    const keys = {
      confirmed: 'Confirmed',
      deaths: 'Deaths',
      recovered: 'Recovered',
    };

    if (optionCond.isNew) {
      keys.confirmed = 'New' + keys.confirmed;
      keys.deaths = 'New' + keys.deaths;
      keys.recovered = 'New' + keys.recovered;
    }

    if (optionCond.isPer100) {
      keys.confirmed = keys.confirmed + 'Per100';
      keys.deaths = keys.deaths + 'Per100';
      keys.recovered = keys.recovered + 'Per100';
    }

    return keys;
  }

  const optionKeys = getKeys(optionCond);

  function formatDate(inputDate: Date | string) {
    let date = new Date();
    if (typeof inputDate === 'string') {
      date = new Date(inputDate);
    } else {
      date = inputDate;
    }
    let dayOfMonth: string | number = date.getDate();
    let month: string | number = date.getMonth() + 1;
    let year: string | number = date.getFullYear();

    year = year.toString().slice(-2);
    month = month < 10 ? '0' + month : month;
    dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;

    return `${dayOfMonth}.${month}.${year}`;
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        sortType: (a: string, b: string) => {
          const a1 = new Date(a).getTime();
          const b1 = new Date(b).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
      },
      {
        Header: 'Confirmed',
        accessor: 'confirmed',
        sortType: 'basic',
      },
      {
        Header: 'Deaths',
        accessor: 'deaths',
        sortType: 'basic',
      },
      {
        Header: 'Recovered',
        accessor: 'recovered',
        sortType: 'basic',
      },
    ],
    []
  );

  const data = React.useMemo(
    () =>
      selectedData?.map((data: any) => {
        return {
          date: formatDate(data.Date),
          confirmed: data[optionKeys.confirmed],
          deaths: data[optionKeys.deaths],
          recovered: data[optionKeys.recovered],
        };
      }),
    [selectedData, optionKeys]
  );

  const initialState = {
    sortBy: [
      {
        id: 'date',
        desc: true,
      },
    ],
  };

  let country = 'Global';
  if (selectedData && selectedData[0] && selectedData[0].Country) {
    country = selectedData[0].Country;
  }

  const cellStyles = {
    confirmed: 'cell--confirmed',
    deaths: 'cell--deaths',
    recovered: 'cell--recovered',
  };

  let flagUrl: any = null;

  if (selectedCountry) {
    flagUrl = countries.find((country) => country.alpha2Code === selectedCountry)?.flag;
  }

  const table = useRef(null);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(setFullScreenElementValue());
    ((table.current as unknown) as HTMLElement).classList.toggle('stats-table__fullscreen');
  };

  const isDataLoaded = data && columns;

  return (
    <div className="stats-table" ref={table}>
      {!isCountryCovidDataLoaded ? (
        'Loading...'
      ) : isCountryCovidDataFailed ? (
        <NoData />
      ) : (
        <React.Fragment>
          <FullScreenMode click={toggle} />
          <div className="stats-table__title">
            {flagUrl && <img className="stats-table__flag" src={flagUrl} alt={country} />}
            <div className="stats-table__country">{country}</div>
          </div>
          <SimpleBar forceVisible="false" className="stats-table__size-scrollbar">
            {isDataLoaded ? (
              <Table
                className="stats-table__table"
                columns={columns}
                data={data}
                initialState={initialState}
                cellStyles={cellStyles}
              ></Table>
            ) : (
              <NoData />
            )}
          </SimpleBar>
        </React.Fragment>
      )}
    </div>
  );
};

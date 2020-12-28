import * as React from 'react';
import './main-stats.css';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '@types';
import { setActiveCountry } from '@store';
import { getStatsOnCurrentOptions } from '@utils';
import { SELECTED_DATA_OPTIONS } from "@constants";

const GLOBAL_STATS_STATE = null;

const switchStatusStats = (status: string | undefined): string => {
  switch (status) {
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED: {
      return 'main-stats__confirmed';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED: {
      return 'main-stats__recovered';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS: {
      return 'main-stats__deaths';
    }
    default: return 'main-stats__no-data';
  }
}

export const MainStats = () => {
  const {
    selectedCountry,
    covidGlobal,
    selectedOptions,
  } = useSelector(
    (state: IAppState) => state
  );

  const dispatch = useDispatch();
  const setCountry = (name: null = GLOBAL_STATS_STATE) => dispatch(setActiveCountry(name));

  const [stats, status] = getStatsOnCurrentOptions(covidGlobal, selectedOptions);

  return <div
    className={`main-stats 
    ${selectedCountry === null ? 'main-stats__active' : ''} ${switchStatusStats(status)}`}
    onClick={() => setCountry()}>
    <h2 className="main-stats__title">Global Cases</h2>
    <p className='main-stats__value'>
      {stats}
    </p>
  </div>
}



import * as React from 'react';
import './country-list.css';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {
  IAppState,
  ICovidInfo,
  ICountryForRender,
} from '@types';
import { setActiveCountry, setFullScreenElementValue } from '@store';
import { getStatsOnCurrentOptions } from "@utils";
import { SELECTED_DATA_OPTIONS } from "@constants";
import { FullScreenMode } from "../full-screen-mode";
import { useRef } from "react";
import { NoData } from '@components';

const switchStatusStats = (status: string | undefined): string => {
  switch (status) {
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED: {
      return 'country-list__confirmed';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED: {
      return 'country-list__recovered';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS: {
      return 'country-list__deaths';
    }
    default:
      return 'country-list__no-data';
  }
};

export const CountryList = () => {
  const {
    covidAllCountries,
    selectedOptions,
    isCovidFailed,
    countries,
    selectedCountry,
    searchValue,
  } = useSelector(
    (state: IAppState) => state
  );

  const dispatch = useDispatch();
  const setCountry = (name: string) => dispatch(setActiveCountry(name));

  let result: ICountryForRender[] = [];
  if (!isCovidFailed) {
    result = countries
      .map(({ name, flag, alpha2Code }) => {
        const alpha2 = alpha2Code as keyof ICovidInfo;
        const [stats, status] = getStatsOnCurrentOptions(
          covidAllCountries[alpha2],
          selectedOptions
        );
        return {
          name: name,
          flag: flag,
          alpha2Code: alpha2Code,
          stats: stats,
          status: status,
        };
      })
      .sort((a, b) => {
        const argA = a.stats as number;
        const argB = b.stats as number;
        return argB - argA;
      });

    if (searchValue) {
      const reg = new RegExp(`^${searchValue}`, 'i');
      result = result.filter((current) => {
        return current.name.match(reg);
      });
    }
  }

  const list = useRef(null);

  const toggle: () => void = () => {
    dispatch(setFullScreenElementValue());
    (list.current as unknown as HTMLElement).classList.toggle('country-list__fullscreen');
  }

  return (
    <ul className="country-list" ref={list} >
      {isCovidFailed ? (
          <NoData />
        ) : (
        <React.Fragment>
          <h2 className="country-list__title">World</h2>
          <FullScreenMode click={ toggle } />
          <SimpleBar forceVisible="false" className="country-list__size-scrollbar">
            {result.map(({name, status, alpha2Code, flag, stats}) => {
              return (
                <li
                  className={`country-list__item ${
                    selectedCountry === alpha2Code ? 'country-list__active-item' : ''
                  }`}
                  key={name}
                  onClick={() => setCountry(alpha2Code as string)}
                >
                  <div className="country-list__row">
                    <img className="country-list__image" src={flag} alt={name}/>
                    {name}
                  </div>
                  <div className="country-list__row">
                    <span className={`country-list__cases-count ${switchStatusStats(status)}`}>
                      {stats}
                    </span>
                  </div>
                </li>
              )
            })}
          </SimpleBar>
        </React.Fragment>
        )}
    </ul>
  );
};

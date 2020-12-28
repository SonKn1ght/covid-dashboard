import * as React from 'react';
import './chart.css';
import Chart, {
  ArgumentAxis,
  Series,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Format,
  Label,
  ValueAxis,
  Tooltip,
  AdaptiveLayout,
} from 'devextreme-react/chart';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState, IColorChart } from '@types';
import { getOnCurrentOptionsChart } from '@utils';
import { TooltipTemplate } from './tooltip';
import { useRef } from 'react';
import { setFullScreenElementValue } from '@store';
import { NoData, FullScreenMode } from '@components';

const COLOR_CHART: IColorChart = {
  Confirmed: '#FF0000',
  Deaths: '#ffffff',
  Recovered: '#329D27',
  ConfirmedPer100: '#FF0000',
  DeathsPer100: '#ffffff',
  RecoveredPer100: '#329D27',
  NewConfirmed: '#FF0000',
  NewDeaths: '#ffffff',
  NewRecovered: '#329D27',
  NewConfirmedPer100: '#FF0000',
  NewDeathsPer100: '#ffffff',
  NewRecoveredPer100: '#329D27',
};
const CHART_COLOR: string = '#ffffff';
const ADAPTIVE_LAYOUT: number = 100;

export const ChartComponent = () => {
  const {
    selectedData,
    isCountryCovidDataFailed,
    isCountryCovidDataLoaded,
    selectedOptions,
  } = useSelector((state: IAppState) => state);

  const dataWithDates = (selectedData || []).map(({ Date: date, ...props }) => ({
    ...props,
    Date: new Date(date),
  }));

  const currentSelected = getOnCurrentOptionsChart(selectedOptions);
  const colorChart: string = COLOR_CHART[currentSelected as keyof IColorChart];

  const chart = useRef(null);
  const dispatch = useDispatch();

  const toggle: () => void = () => {
    dispatch(setFullScreenElementValue());

    ((chart.current as unknown) as HTMLElement).classList.toggle('chart__fullscreen');
  };

  const isDataLoaded = dataWithDates && dataWithDates.length > 0;

  return (
    <div className="chart" ref={chart}>
      {!isCountryCovidDataLoaded ? (
        'Loading...'
      ) : isCountryCovidDataFailed ? (
        <NoData />
      ) : (
        <React.Fragment>
          <FullScreenMode click={toggle} />
          {isDataLoaded ? (
            <Chart dataSource={dataWithDates} id="chart-country">
              <CommonSeriesSettings argumentField="Date" type="spline" />
              <CommonAxisSettings color={CHART_COLOR}>
                <Grid visible={true} />
              </CommonAxisSettings>
              <Series
                valueField={`${currentSelected}`}
                name={`${currentSelected}`}
                color={colorChart}
              />
              <ArgumentAxis>
                <Label font={{ color: CHART_COLOR }}>
                  <Format type="shortDate" />
                </Label>
              </ArgumentAxis>

              <ValueAxis allowDecimals>
                <Label font={{ color: CHART_COLOR }}>
                  <Format type="largeNumber" />
                </Label>
              </ValueAxis>
              <Tooltip enabled={true} contentRender={TooltipTemplate} />
              <AdaptiveLayout keepLabels={true} width={ADAPTIVE_LAYOUT} />
            </Chart>
          ) : (
            <NoData />
          )}
        </React.Fragment>
      )}
    </div>
  );
};

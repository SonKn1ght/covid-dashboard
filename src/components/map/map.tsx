import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { setActiveCountry, setFullScreenElementValue } from '@store';
import { IAppState } from '@types';
import 'leaflet/dist/leaflet.css';
import './map.css';
import geoJson from './countries.json';
import L, { Layer } from 'leaflet';
import { getStatsOnCurrentOptions } from '@utils';
import Legend from './legend';
import { useRef } from 'react';
import { FullScreenMode } from '../full-screen-mode';

export const Map = () => {
  const dispatch = useDispatch();
  const setCountry = (name: string) => dispatch(setActiveCountry(name));
  const intensivity = useSelector((state: IAppState) => state.intensivity);
  const covidAllCountries = useSelector((state: IAppState) => state.covidAllCountries);
  const selectedCountry = useSelector((state: IAppState) => state.selectedCountry);
  const selectedOptions = useSelector((state: IAppState) => state.selectedOptions);

  const [intensivityItem]: any = getStatsOnCurrentOptions(intensivity, selectedOptions);

  const labelPerCountry = (feature: any) => {
    const alpha2Code = feature.properties.iso_a2;
    const name = feature.properties.name;
    const data = covidAllCountries[alpha2Code];
    let covidInfo = '';
    if (data) {
      const [stats, status] = getStatsOnCurrentOptions(
        covidAllCountries[alpha2Code],
        selectedOptions
      );
      covidInfo = `${status}: ${stats}`;
    } else {
      covidInfo = 'No data';
    }
    return `<div>${name}</div><div class="uc-first">${covidInfo}</div>`;
  };

  const colorsObject: any = {
    confirmed: ['#FEB24C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'],

    deaths: ['#fff', '#d4d1d1', '#a5a3a3', '#777575', '#4b4949'],

    recovered: ['#dbf5d8', '#abeea3', '#82ec76', '#55c549', '#329D27'],
  };

  const colors = selectedOptions
    ? colorsObject[selectedOptions.activeStatus]
    : colorsObject.confirmed;

  const onEachCountry = (feature: any, layer: Layer) => {
    const alpha2Code = feature.properties.iso_a2;

    if (alpha2Code === selectedCountry) {
      layer.bindTooltip(() => labelPerCountry(feature), { permanent: true });
    } else {
      layer.bindTooltip(() => labelPerCountry(feature));
    }

    (layer as any).setStyle({
      fillColor: colors[0],
      fillOpacity: 1,
      color: 'red',
      weight: 1,
    });

    layer.on({
      click: () => {
        if (covidAllCountries[alpha2Code]) {
          setCountry(alpha2Code);
        }
      },
    });

    if (covidAllCountries[alpha2Code]) {
      const [current]: any = getStatsOnCurrentOptions(
        covidAllCountries[alpha2Code],
        selectedOptions
      );

      const colorIndex = (intensivityItem || []).findIndex((item: any) => current <= item);

      let color = colors[0];

      if (colorIndex === -1) {
        color = colors[colors.length - 1];
      } else {
        color = colors[colorIndex];
      }

      (layer as any).setStyle({
        fillColor: color,
      });
    }
  };

  const southWest = L.latLng(-83.27770503961696, -243.98437500000003);
  const northEast = L.latLng(83.27770503961696, 244.68750000000003);
  const bounds = L.latLngBounds(southWest, northEast);

  const key = JSON.stringify(selectedOptions) + (selectedCountry || 'null');

  const map = useRef(null);

  const toggle = () => {
    dispatch(setFullScreenElementValue());
    ((map.current as unknown) as HTMLElement).classList.toggle('map-container__full-screen');

    if (map && map.current) {
      window.dispatchEvent(new Event('resize'));
    }
  };

  return (
    <div className="map-container" ref={map}>
      <FullScreenMode click={toggle} />
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[0, 0]}
        zoom={1}
        maxZoom={3}
        minZoom={1}
        maxBounds={bounds}
      >
        <GeoJSON key={key} data={geoJson as any} onEachFeature={onEachCountry} />

        <Legend intensivity={intensivityItem} colors={colors} />
      </MapContainer>
    </div>
  );
};

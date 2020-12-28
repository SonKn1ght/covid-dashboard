export const RESTCOUNTRIES = {
  countries: {
    url:
      'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code',
    params: {},
    handler: (data: any) => data,
  },
};

const FetchAdapter = require('../httpadapter/fetchadapter');
const AbstractGeocoder = require('./abstractgeocoder');
const nodeFetch = require('node-fetch');

/**
 * available options
 * @see https://docs.radar.com/maps/geocoding
 */
const OPTIONS = [
  'apiKey',
];

const OPTIONS_MAP = {};

/**
 * Constructor
 * @param <object> httpAdapter Http Adapter
 * @param <object> options Options (apiKey, language, country, autocomplete, bbox, fuzzyMatch, limit, proximity, routing)
 */
class RadarGeocoder extends AbstractGeocoder {
  constructor(httpAdapter, options) {
    if (!options.apiKey) {
      throw new Error('You must specify apiKey to use Radar Geocoder');
    }

    const headers = {
      Authorization: options.apiKey,
    };
    delete options.apiKey;

    super(new FetchAdapter(options, headers), options);
  }

  /**
   * Geocode
   * @param <string>   value    Value to geocode (Address)
   * @param <function> callback Callback method
   */
  _geocode(value, callback) {
    let params = this._prepareQueryString({});

    const endpoint = `${this._geocodeEndpoint}?query=${encodeURIComponent(value)}`;

    this.httpAdapter.get(endpoint, params, (err, result) => {
      if (err) {
        return callback(err, []);
      } else {
        try {
          const results = result.addresses.map(this._formatResult);
          results.raw = result;
          return callback(false, results);
        } catch (e) {
          e.response = result;
          return callback(e, []);
        }
      }
    });
  }

  _formatResult(result) {
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      formattedAddress: result.formattedAddress,
      number: result.number,
      street: result.street,
      country: result.country,
      countryCode: result.countryCode,
      state: result.state,
      stateCode: result.stateCode,
      district: result.district,
      county: result.county,
      city: result.city,
      zipcode: result.postalCode,
      extra: {
        addressLabel: result.addressLabel,
        countryFlag: result.countryFlag,
      }
    };
  }

  _prepareQueryString(params) {
    OPTIONS.forEach(key => {
      const val = this.options[key];
      if (val) {
        const _key = OPTIONS_MAP[key] || key;
        params[_key] = val;
      }
    });

    return params;
  }
}

Object.defineProperties(RadarGeocoder.prototype, {
  _geocodeEndpoint: {
    get: function () {
      return 'https://api.radar.io/v1/geocode/forward';
    }
  }
});

module.exports = RadarGeocoder;

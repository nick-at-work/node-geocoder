const NodeGeocoder = require('../../index');

describe('Radar geocoder', () => {
  let geocoder;

  beforeAll(() => {
    const apiKey = process.env.RADAR_API_KEY;
    const options = {
      provider: 'radar',
      apiKey
    };

    if (!apiKey || apiKey === '') {
      throw new Error('RADAR_API_KEY not configured');
    }

    geocoder = NodeGeocoder(options);
  });

  describe('geocode', () => {
    it('works', async () => {
      const res = await geocoder.geocode('1604 North Loop 1604 E, San Antonio, TX 78232');
      expect(res).toBeDefined();
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 29.60888,
        longitude: -98.47017,
        formattedAddress: '1604 N Loop 1604 E, San Antonio, TX 78232 US',
        country: 'United States',
        countryCode: 'US',
        city: 'San Antonio',
        zipcode: '78232'
      });
    });
  });

  xdescribe('reverse', () => {
    it('works', async () => {
      const res = await geocoder.reverse({ lat: 45.521056, lon: -73.610734 });
      expect(res[0]).toBeDefined();
      expect(res[0]).toMatchObject({
        latitude: 45.5210619,
        longitude: -73.61070029999999,
        formattedAddress: '1231 Av. Lajoie, Outremont, QC H2V 1P2, Canada',
        country: 'Canada',
        countryCode: 'CA',
        city: 'Montréal',
        zipcode: 'H2V 1P2'
      });
    });
  });
});

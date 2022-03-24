const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const config = require('../config')

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock GET request to /users when param `searchText` is 'John'
// arguments for reply are (status, data, headers)

const GetCoinPriceURL = new RegExp(`${config.COINGECKO_COIN_DETAILS_URL}/.*`)

mock
  .onGet(GetCoinPriceURL)
  .replyOnce(404, { error: 'Could not find coin with the given id' })
  .onGet(GetCoinPriceURL)
  .replyOnce(429, { error: 'you are rate limited' })
  .onGet(GetCoinPriceURL)
  .reply(200, {
    id: 'doge',
    symbol: 'doge',
    name: 'Dogecoin',
    market_data: {
      current_price: {
        usd: 43390,
      },
    },
  });

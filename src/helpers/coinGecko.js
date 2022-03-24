const axios = require('axios');
const errors = require('./errors');
const config = require('../../config')

module.exports = {
  async getCoinPrice(coin) {
    const price = await axios
      .get(`${config.COINGECKO_COIN_DETAILS_URL}/${coin}`)
      .then(({data}) => {
        return { data }
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 404) return { error: 'coin_price_api_not_found' };
        else if (err.response.status === 429) return { error: 'coin_price_api_rate_limit' };
        else return { error: 'unknown_error' };
      });

    errors.assertExposable(price.error === undefined, price.error);

    return price.data.market_data.current_price.usd;
  },
};

const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const { getCoinPrice } = require('../../../helpers/coinGecko');
const ONE_HOUR = 60 * 60 * 1000;

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    if (coin.price === null || new Date() - new Date(coin.updateAt) > ONE_HOUR) {
      const price = await getCoinPrice(coinCode.toLowerCase());
      await Models.Coin.updateCoinPriceByCode(coinCode, price.toString());
      coin.price = price.toString();
    }

    return coin.filterKeys();
  },

  async createCoin(data) {
    const coin = await Models.Coin.createCoin(data)
      .then((data) => ({ data }))
      .catch((err) => {
        console.log(err.errors[0].message);
        if (err.errors[0].message == 'code must be unique') return { error: 'coin_code_exists' };
        else return { error: 'create_coin_unknown_error' };
      });

    errors.assertExposable(coin.error === undefined, coin.error);

    return coin.data.filterKeys();
  },
};

module.exports = CoinController;

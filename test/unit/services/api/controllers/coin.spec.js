const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('Should fail to get coin by code if code not exist in CoinGecko', async () => {
      const coinCode = 'BTC';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'coin_price_api_not_found');
    });

    it('Should fail to get coin by code if CoinGecko returned To Many Requests Status Code', async () => {
      const coinCode = 'BTC';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'coin_price_api_rate_limit');
    });

    it('Should get coin by code', async () => {
      const coinCode = 'BTC';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(3);
    });

    it('Should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });
  });

  describe('createCoin', () => {
    it('Should create coin', async () => {
      const coinData = { code: 'DOGE', name: 'Dogecoin' };
      const coin = await CoinController.createCoin(coinData);

      expect(coin.code).to.eq(coinData.code);
      expect(Object.keys(coin).length).to.eq(2);
    });

    it('Should fail to create coin if coin code exist', async () => {
      const coinData = { code: 'DOGE', name: 'Dogecoin' };
      const coin = await CoinController.createCoin(coinData);

      expect(coin.code).to.eq(coinData.code);
      expect(Object.keys(coin).length).to.eq(2);

      expect(CoinController.createCoin(coinData)).to.be.rejectedWith(Error, 'coin_code_exists');
    });
    5;
  });
});

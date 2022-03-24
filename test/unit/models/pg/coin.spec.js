const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const Models = require(path.join(srcDir, '/models/pg'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Model:coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.coin = await Models.Coin.findByPk('26a05507-0395-447a-bbbb-000000000000');
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  it('Should create without price', async () => {
    const coin = await Models.Coin.create({
      name: 'Bitcoin Cash',
      code: 'BCH',
    });

    expect(coin.name).to.eq('Bitcoin Cash');
    expect(coin.code).to.eq('BCH');
    expect(coin.price).to.be.undefined;
  });

  it('Should create with price', async () => {
    const coin = await Models.Coin.create({
      name: 'Bitcoin Cash',
      code: 'BCH',
      price: "7845.5"
    });

    expect(coin.name).to.eq('Bitcoin Cash');
    expect(coin.code).to.eq('BCH');
    expect(coin.price).to.eq('7845.5');

  });

  it('Should fail to create coin if coin code exist', async () => {
    const coinData = {
      name: 'Dogecoin',
      code: 'DOGE',
    }
    const firstTime = await Models.Coin.create(coinData);
    const secondTime = Models.Coin.create(coinData);

    expect(firstTime.name).to.eq('Dogecoin');
    expect(firstTime.code).to.eq('DOGE');
    expect(firstTime.price).to.be.undefined;

    expect(secondTime).to.be.rejectedWith(Error, 'Validation error');
  });

  it('Should find by coinCode', async () => {
    const coinCode = this.coin.code;
    const coin = await Models.Coin.findByCoinCode(coinCode);

    expect(coin.id).to.eq(this.coin.id);
  });

  it('Should filterKeys', async () => {
    const coin = await Models.Coin.create({
      name: 'Amon',
      code: 'AMN',
      price: "15.8"
    });

    const filterCoin = coin.filterKeys();
    expect(Object.keys(filterCoin).length).to.eq(3);
  });
});

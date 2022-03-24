'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Coin', 'price', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Coin', 'price');
  },
};

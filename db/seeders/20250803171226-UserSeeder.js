'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 
    await queryInterface.bulkInsert('users', [
      {
        name: 'Taha Mansouri',
        email: 'taha@example.com',
        password: 'hashed_pass_1',
      },
      {
        name: 'Ali B.',
        email: 'ali@example.com',
        password: 'hashed_pass_2',
      },
      {
        name: 'Sara K.',
        email: 'sara@example.com',
        password: 'hashed_pass_3',

      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};

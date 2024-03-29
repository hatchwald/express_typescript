'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'books',
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
        }
      },
      rent_at: {
        type: Sequelize.DATE
      },
      return_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['rent', 'returned']
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rents');
  }
};
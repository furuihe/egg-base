'use strict';

exports.keys = '123456';

module.exports = appInfo => {
  const config = exports;

  config.sequelize = {
    dialect: 'postgres', // support: mysql, mariadb, postgres, mssql
    database: 'test',
    host: 'localhost',
    port: '5432',
    username: 'test',
    password: '123456',
    define: {
      freezeTableName: false,
      underscored: false,
    },
  };

  config.user = {
    sync: true,
  };

  return config;
};

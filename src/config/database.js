const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  dialect: 'mssql',
  host: '138.97.105.135',
  username: "asplan2",
  password: "setasp@3305",
  database: "asplan",
  connectionTimeout: 3000000,
  requestTimeout: 3000000,
  logging: false,
  operatorsAliases: {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $gt: Op.gt,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like
  },
  define: {
    timestamps: true,
    underscored: false,
    underscoredAll: false,
    createdAt: false,
    updatedAt: false,
  },
  pool: {
    idleTimeoutMillis: 3000000,
    max: 100
  },
  dialectOptions: {
    timezone: 'America/Sao_Paulo',
    options: {
      encrypt: false
    }
  },
  timezone: 'America/Sao_Paulo',
};


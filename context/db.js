
module.exports = (Sequelize, config) => {

    const dbConfig = process.env.PMZ_PROJECT === 'production' ? config.prod : config.db;

    const options = {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: false,
        define: {
            timestamps: true,
            paranoid: true,
            defaultScope: {
                where: {
                    deletedAt: { $eq: null }
                }
            }
        }
    };

    const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, options);
    const User = require('../models/user')(Sequelize, sequelize);
    const Domain = require('../models/domain')(Sequelize, sequelize);
    const UserDomains = require('../models/userDomains')(Sequelize, sequelize);


    User.hasMany(Domain);


    return {
        user: User,
        domain: Domain,
        userDomains: UserDomains,
        sequelize: sequelize
    };
};
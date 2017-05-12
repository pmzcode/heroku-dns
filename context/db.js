module.exports = (Sequelize, config) => {
    var sequelize;
    if (process.env.DATABASE_URL) {
        var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
        sequelize = new Sequelize(match[5], match[1], match[2], {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     match[4],
            host:     match[3],
            logging: false,
            dialectOptions: {
                ssl: true
            }
        });
    } else {
        const options = {
            host: config.db.host,
            dialect: config.db.dialect,
            logging: false,
            define: {
                timestamps: true,
                paranoid: true,
                defaultScope: {
                    where: {
                        deletedAt: {$eq: null}
                    }
                }
            }
        };

        const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, options);
    }
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
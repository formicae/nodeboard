const mongoose = require('mongoose');
const userdata = require('../auth/userdata.json');
module.exports = () => {
    const connect = () => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.Promise = global.Promise;
        mongoose.set('useCreateIndex', true);
        mongoose.connect(`mongodb://${userdata.username}:${userdata.password}@127.0.0.1:27017/admin`, {
            dbName:'nodejs',
            useNewUrlParser : true,
        }, (err) => {
            if (err) {
                console.log('Mongodb connection error!', err);
            } else { console.log('connection success!'); }
        });
    };

    connect();
    mongoose.connection.on('error', (err) => {
        console.error('mongodb connection error@@',err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('dis-connected! redirecting...');
    });
    require('./user');
    require('./board');
};

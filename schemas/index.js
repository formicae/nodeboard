const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.Promise = global.Promise;
        mongoose.set('useCreateIndex', true)
        mongoose.connect('mongodb://youngmo:Dldudah12!@127.0.0.1:27017/admin', {
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
    require('./ArticleNumber');
};

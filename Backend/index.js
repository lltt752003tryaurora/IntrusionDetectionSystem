const express = require('express');
const yaml_config = require('node-yaml-config');
const { connect } = require('./db/index');
const { sendEmail } = require('./services/emailService');
const sesssion = require('express-session');
const MongoStore = require('connect-mongo');

const startServer = async () => {
    try {
        const app = express();

        const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
        const config = yaml_config.load(__dirname + '/config/config.yaml', ENVIRONMENT);

        const db = await connect(config.database.uri);
        console.log('Connected to database.');

        app.use(sesssion({
            secret: config.session.secret,
            resave: false,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl: config.database.uri,
                collectionName: 'sessions',
            }),
            cookie: {
                maxAge: 1000 * 60 * 60,
            },
        }));

        app.use(express.json());

        app.use(`/${config.api.version}`, require('./routes/apiRouter'));

        const PORT = process.env.PORT || 3030;
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`);
        });
    } catch (error) {
        console.error(error.message, error.stack);
    }
}

startServer()
    // .then(() => {
    //     sendEmail({
    //         // to: 'tohienvinh@gmail.com',
    //         tos: ['tohienvinh@gmail.com', 'ezionoir@outlook.com'],
    //         details: {
    //             time: Date.now(),
    //             suspectedThreats: ['DDOS', 'DOS']
    //         }
    //     });
    // });

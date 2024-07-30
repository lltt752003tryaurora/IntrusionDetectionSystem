const express = require('express');
const cors = require('cors');
const { connect } = require('./db/index');
const sesssion = require('express-session');
const MongoStore = require('connect-mongo');
const config = require('./services/configService');

const startServer = async () => {
    try {
        const app = express();

        app.use(cors({
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));

        await connect(config.database.uri);
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

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`);
        });
    } catch (error) {
        console.error(error.message, error.stack);
    }
}

startServer();

const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../services/configService');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const modelEndpoint = config.predict.endpoint;

const controller = {
    obserseCsvFile: [
        upload.single('file'),
        async (req, res, next) => {
            if (!req.file) return res.status(404).send({ message: 'CSV file required.' });

            try {

                const form = new FormData();
                form.append('file', req.file.buffer, req.file.originalname);
                const response = await axios.post(modelEndpoint, form, {
                    headers: {
                        ...form.getHeaders(),
                    }
                });

                res.status(200).send({
                    message: 'Success',
                    data: response.data
                })
            } catch (error) {
                console.error(error.message);
                res.status(500).send({
                    data: error
                })
            }
        }
    ]
}

module.exports = controller;
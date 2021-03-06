/*
 * Copyright 2018 Expedia, Inc.
 *
 *         Licensed under the Apache License, Version 2.0 (the "License");
 *         you may not use this file except in compliance with the License.
 *         You may obtain a copy of the License at
 *
 *             http://www.apache.org/licenses/LICENSE-2.0
 *
 *         Unless required by applicable law or agreed to in writing, software
 *         distributed under the License is distributed on an "AS IS" BASIS,
 *         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *         See the License for the specific language governing permissions and
 *         limitations under the License.
 */

const express = require('express');

const handleResponsePromise = require('./utils/apiResponseHandler').handleResponsePromise;
const servicesConnector = require('../connectors/services/servicesConnector');

const router = express.Router();

router.get('/services', (req, res, next) => {
    handleResponsePromise(res, next, 'services')(
        () => servicesConnector.getServices()
    );
});

router.get('/operations', (req, res, next) => {
    handleResponsePromise(res, next, 'operations')(
        () => servicesConnector.getOperations(req.query.serviceName)
    );
});

module.exports = router;

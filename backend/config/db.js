// config/db.js
const axios = require('axios');
require('dotenv').config();

const GRAPHDB_BASE_URL = process.env.GRAPHDB_URL || 'http://localhost:7200';
const REPOSITORY = process.env.GRAPHDB_REPO || 'ecommerce';

const sparqlEndpoint = `${GRAPHDB_BASE_URL}/repositories/${REPOSITORY}`;

const executeQuery = async (query, headers = {}) => {
    try {
        const response = await axios.post(
            sparqlEndpoint,
            `query=${encodeURIComponent(query)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/sparql-results+json',
                    ...headers
                }
            }
        );
        return response.data.results.bindings;
    } catch (error) {
        console.error('SPARQL Query Error:', error);
        throw error;
    }
};

const updateQuery = async (query) => {
    try {
        const response = await axios.post(
            `${GRAPHDB_BASE_URL}/repositories/${REPOSITORY}/statements`,
            `update=${encodeURIComponent(query)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('SPARQL Update Error:', error);
        throw error;
    }
};

module.exports = { executeQuery, updateQuery };
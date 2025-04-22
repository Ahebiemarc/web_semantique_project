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

        // Gestion des différents types de réponses
        if (response.data.boolean !== undefined) {
            // Cas des requêtes ASK
            return { boolean: response.data.boolean };
        }

        if (response.data.results?.bindings !== undefined) {
            // Cas des requêtes SELECT
            return { bindings: response.data.results.bindings };
        }

        throw new Error("Réponse SPARQL inattendue");
    } catch (error) {
        console.error('SPARQL Query Error:', error.response?.data || error.message);
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
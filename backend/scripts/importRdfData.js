const fs = require('fs');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

// Configuration
const GRAPHDB_URL = process.env.GRAPHDB_URL || 'http://localhost:7200';
const REPO_ID = process.env.GRAPHDB_REPO || 'ecommerce';
const FILE_PATH = path.join(__dirname, './conversion/ecommerce_data.ttl');

// Lire le fichier RDF
const rdfData = fs.readFileSync(FILE_PATH, 'utf8');

// Envoyer les données RDF vers GraphDB
axios.post(`${GRAPHDB_URL}/repositories/${REPO_ID}/statements`, rdfData, {
    headers: {
        'Content-Type': 'text/turtle'
    }
})
.then(() => {
    console.log('✅ Données RDF importées avec succès dans GraphDB.');
})
.catch((error) => {
    if (error.response) {
        console.error('❌ Erreur lors de l’importation :');
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        console.error('Body:', error.response.data);
    } else {
        console.error('❌ Erreur réseau ou autre :', error.message);
    }
});


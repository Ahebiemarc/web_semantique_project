
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Configuration
const GRAPHDB_URL = process.env.GRAPHDB_URL || 'http://localhost:7200';
const REPO_ID = process.env.GRAPHDB_REPO || 'ecommerce';
const FILE_PATH = path.join(__dirname, '../ontologie/ecommerce.ttl');

// Lire le fichier
const data = fs.readFileSync(FILE_PATH, 'utf8');

// Faire la requête POST
axios.post(`${GRAPHDB_URL}/repositories/${REPO_ID}/statements`, data, {
    headers: {
        'Content-Type': 'text/turtle'
    }
}).then(() => {
    console.log('✅ Ontologie importée avec succès dans GraphDB.');
}).catch((error) => {
    console.error('❌ Erreur lors de l’importation :', error.response?.data || error.message);
});

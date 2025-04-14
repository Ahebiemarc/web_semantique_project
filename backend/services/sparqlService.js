// services/sparqlService.js

const { executeQuery, updateQuery } = require('../config/db');

const PREFIXES = `
PREFIX ex: <http://example.org/ecommerce#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
`;

class SparqlService {
    // Méthode générique pour exécuter des requêtes SELECT
    async selectQuery(query) {
        const fullQuery = PREFIXES + query;
        return await executeQuery(fullQuery);
    }

    // Méthode générique pour exécuter des requêtes UPDATE
    async updateQuery(query) {
        const fullQuery = PREFIXES + query;
        return await updateQuery(fullQuery);
    }

    // Récupérer un utilisateur par ID
    async getUserById(userId) {
        const query = `
        SELECT ?username ?email WHERE {
            ex:user_${userId} ex:username ?username ;
                               ex:email ?email .
        }
        `;
        const results = await this.selectQuery(query);
        return results[0] || null;
    }

    // Récupérer les produits d'une catégorie
    async getProductsByCategory(categoryId, limit = 10) {
        const query = `
        SELECT ?product ?name ?price ?image WHERE {
            ?product ex:belongsToCategory ex:category_${categoryId} ;
                     ex:productName ?name ;
                     ex:price ?price ;
                     ex:image ?image .
        }
        LIMIT ${limit}
        `;
        return await this.selectQuery(query);
    }

    // Ajouter un nouvel utilisateur
    async createUser(userData) {
        const { username, email, password } = userData;
        const userId = Date.now(); // Générer un ID unique
        
        const query = `
        INSERT DATA {
            ex:user_${userId} rdf:type ex:User ;
                              ex:username "${username}" ;
                              ex:email "${email}" ;
                              ex:password "${password}" .
        }
        `;
        
        await this.updateQuery(query);
        return userId;
    }

    // Enregistrer une commande
    async createOrder(userId, productId) {
        const orderId = Date.now();
        const now = new Date().toISOString().split('T')[0];
        
        const query = `
        INSERT DATA {
            ex:order_${orderId} rdf:type ex:Order ;
                                ex:orderDate "${now}"^^xsd:date .
            
            ex:user_${userId} ex:hasOrder ex:order_${orderId} .
            ex:order_${orderId} ex:containsProduct ex:product_${productId} .
        }
        `;
        
        await this.updateQuery(query);
        return orderId;
    }
}

module.exports = new SparqlService();
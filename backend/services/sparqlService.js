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
        const result = await executeQuery(fullQuery);
    
        // Si c’est une requête ASK, retourne le booléen
        if ('boolean' in result) return result.boolean;
    
        // Sinon retourne les bindings de SELECT
        return result.bindings || [];
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


    async getProductById(productId) {
        const query = `
        SELECT ?name ?price ?image ?categoryId WHERE {
            ex:product_${productId} ex:productName ?name ;
                                    ex:price ?price ;
                                    ex:image ?image ;
                                    ex:belongsToCategory ?category .
            BIND(STRAFTER(STR(?category), "category_") AS ?categoryId)
        }
        `;
        return await this.selectQuery(query);
    }
    


    async getProductsByPriceLessThan(priceValue) {
        const query = `
        SELECT ?product ?name ?price ?image ?categoryId WHERE {
            ?product a ex:Product ;
                     ex:productName ?name ;
                     ex:price ?price ;
                     ex:image ?image ;
                     ex:belongsToCategory ?category .
    
            BIND(STRAFTER(STR(?category), "category_") AS ?categoryId)
    
            FILTER(?price <= ${priceValue})
        }
        `;
        return await this.selectQuery(query);
    }


    async getProductsByPriceGreaterThan(priceValue) {
        const query = `
        SELECT ?product ?name ?price ?image ?categoryId WHERE {
            ?product a ex:Product ;
                     ex:productName ?name ;
                     ex:price ?price ;
                     ex:image ?image ;
                     ex:belongsToCategory ?category .
    
            BIND(STRAFTER(STR(?category), "category_") AS ?categoryId)
    
            FILTER(?price >= ${priceValue})
        }
        `;
        return await this.selectQuery(query);
    }

    async getProductsByName(searchTerm) {
        const words = searchTerm.trim().toLowerCase().split(/\s+/); // coupe par mot
        const filters = words.map(
            word => `CONTAINS(LCASE(?name), "${word}")`
        ).join(' || '); // au moins un mot
    
        const query = `
        SELECT ?product ?name ?price ?image ?categoryId WHERE {
            ?product a ex:Product ;
                     ex:productName ?name ;
                     ex:price ?price ;
                     ex:image ?image ;
                     ex:belongsToCategory ?category .
    
            BIND(STRAFTER(STR(?category), "category_") AS ?categoryId)
    
            FILTER(${filters})
        }
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
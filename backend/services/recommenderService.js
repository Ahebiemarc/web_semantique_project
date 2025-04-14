// services/recommenderService.js

const sparqlService = require('./sparqlService');

class RecommenderService {
    // Recommandations basées sur les préférences
    async getPreferenceBasedRecommendations(userId, limit = 5) {
        const query = `
        SELECT ?product ?name ?price ?image (AVG(?rating) as ?avgRating) WHERE {
            ex:user_${userId} ex:hasPreference ?pref .
            ?pref ex:preferredCategory ?cat .
            
            ?product ex:belongsToCategory ?cat ;
                     ex:productName ?name ;
                     ex:price ?price ;
                     ex:image ?image .
            
            OPTIONAL {
                ?review ex:reviewedProduct ?product ;
                        ex:rating ?rating .
            }
            
            FILTER NOT EXISTS {
                ex:user_${userId} ex:hasOrder ?order .
                ?order ex:containsProduct ?product .
            }
        }
        GROUP BY ?product ?name ?price ?image
        ORDER BY DESC(?avgRating)
        LIMIT ${limit}
        `;
        
        return await sparqlService.selectQuery(query);
    }

    // Recommandations basées sur l'historique
    async getHistoryBasedRecommendations(userId, limit = 5) {
        const query = `
        SELECT ?recommendedProduct ?name ?price ?image (AVG(?rating) as ?avgRating) WHERE {
            # Produits achetés par l'utilisateur
            ex:user_${userId} ex:hasOrder ?order .
            ?order ex:containsProduct ?purchasedProduct .
            ?purchasedProduct ex:belongsToCategory ?category .
            
            # Produits similaires dans les mêmes catégories
            ?recommendedProduct ex:belongsToCategory ?category ;
                               ex:productName ?name ;
                               ex:price ?price ;
                               ex:image ?image .
            
            # Exclure les produits déjà achetés
            FILTER (?recommendedProduct != ?purchasedProduct)
            FILTER NOT EXISTS {
                ex:user_${userId} ex:hasOrder ?otherOrder .
                ?otherOrder ex:containsProduct ?recommendedProduct .
            }
            
            # Notes moyennes
            OPTIONAL {
                ?review ex:reviewedProduct ?recommendedProduct ;
                        ex:rating ?rating .
            }
        }
        GROUP BY ?recommendedProduct ?name ?price ?image
        ORDER BY DESC(?avgRating)
        LIMIT ${limit}
        `;
        
        return await sparqlService.selectQuery(query);
    }

    // Mettre à jour les préférences utilisateur
    async updateUserPreferences(userId, categoryId) {
        const query = `
        DELETE {
            ex:user_${userId} ex:hasPreference ?oldPref .
            ?oldPref ?p ?o .
        }
        WHERE {
            OPTIONAL {
                ex:user_${userId} ex:hasPreference ?oldPref .
                ?oldPref ?p ?o .
            }
        };
        
        INSERT DATA {
            ex:pref_${userId}_${Date.now()} rdf:type ex:Preference ;
                                            ex:preferredCategory ex:category_${categoryId} .
            
            ex:user_${userId} ex:hasPreference ex:pref_${userId}_${Date.now()} .
        }
        `;
        
        await sparqlService.updateQuery(query);
    }
}

module.exports = new RecommenderService();
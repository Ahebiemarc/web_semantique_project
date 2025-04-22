// services/recommenderService.js

const sparqlService = require('./sparqlService');

class RecommenderService {
    // Recommandations basées sur les préférences
    async getPreferenceBasedRecommendations(userId, limit = 100) {
        const query = `
        SELECT ?product ?name ?price ?image ?categoryId (AVG(?rating) as ?avgRating) WHERE {
            ex:user_${userId} ex:hasPreference ?pref .
            ?pref ex:preferredCategory ?cat .
    
            ?product ex:belongsToCategory ?cat ;
                     ex:productName ?name ;
                     ex:price ?price ;
                     ex:image ?image ;
                     ex:belongsToCategory ?category .
    
            BIND(STRAFTER(STR(?category), "category_") AS ?categoryId)
    
            OPTIONAL {
                ?review ex:reviewedProduct ?product ;
                        ex:rating ?rating .
            }
    
            FILTER NOT EXISTS {
                ex:user_${userId} ex:hasOrder ?order .
                ?order ex:containsProduct ?product .
            }
        }
        GROUP BY ?product ?name ?price ?image ?categoryId
        ORDER BY DESC(?avgRating)
        LIMIT ${limit}
        `;
    
        return await sparqlService.selectQuery(query);
    }
    

    // Recommandations basées sur l'historique
    async getHistoryBasedRecommendations(userId, limit = 100) {
        const query = `
        SELECT ?recommendedProduct ?name ?price ?image ?categoryId (AVG(?rating) as ?avgRating) WHERE {
            # Produits achetés par l'utilisateur
            ex:user_${userId} ex:hasOrder ?order .
            ?order ex:containsProduct ?purchasedProduct .
            ?purchasedProduct ex:belongsToCategory ?category .
    
            # Produits similaires dans les mêmes catégories
            ?recommendedProduct ex:belongsToCategory ?category ;
                                ex:productName ?name ;
                                ex:price ?price ;
                                ex:image ?image .
    
            BIND(STRAFTER(STR(?category), "category_") AS ?categoryId)
    
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
        GROUP BY ?recommendedProduct ?name ?price ?image ?categoryId
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

    //tu obtiens une liste triée par score pondéré, issue de deux sources,
    async getHybridRecommendations(userId, limit = 10) {
        const prefWeight = 0.6;
        const histWeight = 0.4;

        const prefBased = await this.getPreferenceBasedRecommendations(userId, limit * 2);
        const histBased = await this.getHistoryBasedRecommendations(userId, limit * 2);

        const productMap = new Map();

        const processList = (list, weight) => {
            for (const product of list) {
                const id = product.product?.value || product.recommendedProduct?.value;
                const rating = parseFloat(product.avgRating?.value || 0);
                const name = product.name?.value;
                const price = product.price?.value;
                const image = product.image?.value;
                //const categoryId = product.category?.value?.split('category_')[1] || null;
                const categoryId = product.categoryId?.value || null;



                if (!productMap.has(id)) {
                    productMap.set(id, {
                        id,
                        name,
                        price,
                        image,
                        categoryId,
                        score: 0
                    });
                }

                const current = productMap.get(id);
                current.score += rating * weight;
            }
        };

        processList(prefBased, prefWeight);
        processList(histBased, histWeight);

        // Convertir en tableau, trier et couper
        const sortedProducts = [...productMap.values()]
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return sortedProducts;
    }

}

module.exports = new RecommenderService();
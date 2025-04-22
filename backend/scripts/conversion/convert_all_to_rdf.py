import pandas as pd
from rdflib import Graph, Literal, Namespace, URIRef
from rdflib.namespace import RDF, RDFS, XSD, OWL

# Initialisation du graphe RDF
g = Graph()
ex = Namespace("http://example.org/ecommerce#")
g.bind("ex", ex)
g.bind("owl", OWL)
g.bind("rdfs", RDFS)

# Chargement des données CSV
users_df = pd.read_csv('data/users.csv')
products_df = pd.read_csv('data/products.csv')
orders_df = pd.read_csv('data/orders.csv')
reviews_df = pd.read_csv('data/reviews.csv')

# Ajout des utilisateurs
for _, row in users_df.iterrows():
    user_uri = URIRef(ex + f"user_{row['id']}")
    g.add((user_uri, RDF.type, ex.User))
    g.add((user_uri, ex.username, Literal(row['username'], datatype=XSD.string)))
    g.add((user_uri, ex.email, Literal(row['email'], datatype=XSD.string)))
    g.add((user_uri, ex.password, Literal(row['password'], datatype=XSD.string)))


# Ajout des produits + catégories
categories_added = set()
for _, row in products_df.iterrows():
    product_uri = URIRef(ex + f"product_{row['id']}")
    category_uri = URIRef(ex + f"category_{row['categoryId']}")
    
    g.add((product_uri, RDF.type, ex.Product))
    g.add((product_uri, ex.productName, Literal(row['name'], datatype=XSD.string)))
    g.add((product_uri, ex.price, Literal(row['price'], datatype=XSD.decimal)))
    g.add((product_uri, ex.image, Literal(row['image'], datatype=XSD.string)))
    g.add((product_uri, ex.belongsToCategory, category_uri))

    if row['categoryId'] not in categories_added:
        g.add((category_uri, RDF.type, ex.Category))
        categories_added.add(row['categoryId'])

# Ajout des commandes
for _, row in orders_df.iterrows():
    order_uri = URIRef(ex + f"order_{row['id']}")
    user_uri = URIRef(ex + f"user_{row['userId']}")
    product_uri = URIRef(ex + f"product_{row['productId']}")
    
    g.add((order_uri, RDF.type, ex.Order))
    g.add((user_uri, ex.hasOrder, order_uri))
    g.add((order_uri, ex.containsProduct, product_uri))
    g.add((order_uri, ex.orderDate, Literal(row['date'], datatype=XSD.date)))

# Ajout des avis
for _, row in reviews_df.iterrows():
    review_uri = URIRef(ex + f"review_{row['id']}")
    user_uri = URIRef(ex + f"user_{row['userId']}")
    product_uri = URIRef(ex + f"product_{row['productId']}")
    
    g.add((review_uri, RDF.type, ex.Review))
    g.add((user_uri, ex.hasReview, review_uri))
    g.add((review_uri, ex.reviewedProduct, product_uri))
    g.add((review_uri, ex.rating, Literal(row['rating'], datatype=XSD.integer)))
    g.add((review_uri, ex.reviewText, Literal(row['reviewText'], datatype=XSD.string)))
    g.add((review_uri, ex.reviewDate, Literal(row['date'], datatype=XSD.date)))

# Sauvegarde
g.serialize(destination="ecommerce_data.ttl", format="turtle")
print("✅ RDF exporté vers ecommerce_data.ttl")

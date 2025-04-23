import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../types/product.types';
import { getRecommendedProducts } from '../../services/product.service';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';

const RecommendedProductsH: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await getRecommendedProducts();
        setRecommended(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recommendations');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 p-4 rounded-md mt-8 text-blue-700 text-center">
        Connectez-vous pour voir vos recommandations personnalisées 🔐
      </div>
    );
  }

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">{error}</div>
    );
  }

  if (recommended.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Aucune recommandation disponible pour le moment.</div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Produits recommandés pour vous 🎯</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommended.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 mt-20">Plus de Produits🎯</h2>

    </div>
  );
};

export default RecommendedProductsH;

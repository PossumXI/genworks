import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface GigCardProps {
  title: string;
  description: string;
  price: number;
  deliveryTime: string;
  seller: {
    name: string;
    rating: number;
    totalGigs: number;
  };
  tags: string[];
}

const GigCard: React.FC<GigCardProps> = ({
  title,
  description,
  price,
  deliveryTime,
  seller,
  tags,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            {seller.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{seller.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{seller.rating}</span>
              <span>({seller.totalGigs} gigs)</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="h-4 w-4" />
          <span>Delivery in {deliveryTime}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500">Starting at</span>
            <p className="text-xl font-bold text-gray-900">${price}</p>
          </div>
          <Button variant="primary" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
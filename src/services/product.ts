import { prisma } from '@/libs/prisma.js';

type ProductFilters = {
  metadata?: { [key: string]: string };
  order?: string;
  limit?: number;
};
export const getAllProducts = async (filters: ProductFilters) => {
  let orderBy = {};
  switch (filters.order) {
    case 'views':
    default:
      orderBy = { viewsCount: 'desc' };
      break;
    case 'selling':
      orderBy = { salesCount: 'desc' };
      break;
    case 'price':
      orderBy = { price: 'asc' };
      break;
  }

  // Build the where clause based on metadata filters
  let where: any = {};
  if (filters.metadata && typeof filters.metadata === 'object') {
    let metadataFilters = [];
    for (let categoryMetadataId in filters.metadata) {
      const value = filters.metadata[categoryMetadataId];
      if (typeof value !== 'string') continue;
      const valueIds = value
        .split('|')
        .map((v) => v.trim())
        .filter(Boolean);
      if (valueIds.length === 0) continue;
      metadataFilters.push({
        metadata: {
          some: {
            categoryMetadataId,
            metadataValueId: { in: valueIds },
          },
        },
      });
    }
    if (metadataFilters.length > 0) {
      where.AND = metadataFilters;
    }
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      label: true,
      price: true,
      images: {
        take: 1,
        orderBy: { id: 'asc' },
      },
    },
    where,
    orderBy,
    take: filters.limit ?? undefined,
  });

  return products.map((product) => ({
    ...product,
    image: product.images[0] ? `media/products/${product.images[0].url}` : null,
    images: undefined,
  }));
};

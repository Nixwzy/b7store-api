import { RequestHandler } from 'express';
import { getProductSchema } from '@/schemas/getProductSchema.js';
import { getAllProducts } from '@/services/product.js';
import { getAbsoluteImageUrl } from '@/utils/getAbsoluteImageUrl.js';

export const getProducts: RequestHandler = async (req, res) => {
  const parseResult = getProductSchema.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Parâmetros inválidos' });
    return;
  }
  const { metadata, orderBy, limit } = parseResult.data;

  const parsedLimit = limit ? parseInt(limit) : undefined;
  const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;

  const products = await getAllProducts({
    metadata: parsedMetadata,
    order: orderBy,
    limit: parsedLimit,
  });

  const productsWithAbsoluteUrl = products.map((product) => ({
    ...product,
    image: product.image ? getAbsoluteImageUrl(product.image) : null,
    liked: false,
  }));

  res.json({ error: null, products: productsWithAbsoluteUrl });
};

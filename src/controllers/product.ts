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
  const { metadata: rawMetadata, orderBy, limit: rawLimit } = parseResult.data;

  const parsedLimit = rawLimit ? parseInt(rawLimit) : undefined;
  const parsedMetadata = rawMetadata ? JSON.parse(rawMetadata) : undefined;

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

export const getOneProduct: RequestHandler = async (req, res) => {

  

  res.json({ error: null });
};

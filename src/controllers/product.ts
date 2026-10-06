import { RequestHandler } from 'express';
import { getProductSchema } from '@/schemas/getProductSchema.js';
import {
  getAllProducts,
  getProduct,
  getProductsFromSameCategory,
  incrementProductViews,
} from '@/services/product.js';
import { getAbsoluteImageUrl } from '@/utils/getAbsoluteImageUrl.js';
import { getOneProductSchema } from '@/schemas/getOneProductSchema.js';
import { getCategory } from '@/services/category.js';
import { getRelatedProductsQuerySchema } from '@/schemas/getOneProductQuery.js';
import { getRelatedProductsSchema } from '@/schemas/getRelatedProductsSchema.js';

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
  const paramsResult = getOneProductSchema.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ error: 'Parâmetros inválidos' });
    return;
  }
  const { id } = paramsResult.data;

  const product = await getProduct(parseInt(id));
  if (!product) {
    res.json({ error: 'Produto não encontrado' });
    return;
  }

  const productWithAbsoluteImages = {
    ...product,
    images: product.images.map((img) => getAbsoluteImageUrl(img)),
  };

  const category = await getCategory(product.categoryId);

  await incrementProductViews(product.id);

  res.json({ error: null, product: productWithAbsoluteImages, category });
};

export const getRelatedProducts: RequestHandler = async (req, res) => {
  const paramsResult = getRelatedProductsSchema.safeParse(req.params);
  const queryResult = getRelatedProductsQuerySchema.safeParse(req.query);

  if (!paramsResult.success || !queryResult.success) {
    res.status(400).json({ error: 'Parâmetros inválidos' });
    return;
  }

  const { id } = paramsResult.data;
  const { limit: rawLimit } = queryResult.data;

  const products = await getProductsFromSameCategory(
    parseInt(id),
    rawLimit ? parseInt(rawLimit) : undefined,
  );

  const productsWithAbsoluteUrl = products.map((product) => ({
    ...product,
    image: product.image ? getAbsoluteImageUrl(product.image) : null,
    liked: false,
  }));

  res.json({ error: null, products: productsWithAbsoluteUrl });
};

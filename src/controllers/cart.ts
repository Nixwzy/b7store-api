import { cartMountSchema } from '@/schemas/cartMountSchema.js';
import { getShippingSchema } from '@/schemas/getShippingSchema.js';
import { getProduct } from '@/services/product.js';
import { getAbsoluteImageUrl } from '@/utils/getAbsoluteImageUrl.js';
import { RequestHandler } from 'express';

export const cartMount: RequestHandler = async (req, res) => {
  const parseResult = cartMountSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: 'Array de IDs inválidos' });
    return;
  }

  const { ids } = parseResult.data;

  let products = [];
  for (const id of ids) {
    const product = await getProduct(id);
    if (product) {
      products.push({
        id: product.id,
        label: product.label,
        price: product.price,
        image: product.images[0]
          ? getAbsoluteImageUrl(product.images[0])
          : null,
      });
    }
  }

  res.json({ error: null, products });
};

export const getShipping: RequestHandler = async (req, res) => {
  const parseResult = getShippingSchema.safeParse(req.query);

  if (!parseResult.success) {
    res.status(400).json({ error: 'CEP inválido' });
    return;
  }

  const { zipcode } = parseResult.data;

  res.json({ error: null, zipcode, cost: 7.0, days: 3 });
};

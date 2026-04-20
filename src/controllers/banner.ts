import { getAllBanners } from '@/services/banner.js';
import { getAbsoluteImageUrl } from '@/utils/getAbsoluteImageUrl.js';
import { RequestHandler } from 'express';

export const getBanners: RequestHandler = async (req, res) => {
  const banners = await getAllBanners();
  const bannersWithAbsoluteUrl = banners.map((banner) => ({
    ...banner,
    img: getAbsoluteImageUrl(banner.img),
  }));
  res.json({ error: null, banners: bannersWithAbsoluteUrl });
};

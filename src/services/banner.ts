import { prisma } from '@/libs/prisma.js';

export const getAllBanners = async () => {
  const banners = await prisma.banner.findMany({
    select: { img: true, link: true },
  });
  return banners;
};

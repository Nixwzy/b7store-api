import { getAllBanners } from "@/services/banner.js";
import { RequestHandler } from "express";

export const getBanners: RequestHandler = async (req, res) => {
    const banners = await getAllBanners();
    res.json( { error: null, banners});
}
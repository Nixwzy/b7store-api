import { getBaseUrl } from "./getBaseUrl.js";

export const getAbsoluteImageUrl = (path: string) => {
    return `${getBaseUrl()}/${path}`;
}
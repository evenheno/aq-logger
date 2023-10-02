import { TPlatform } from "../types/types.js";
export const platform: TPlatform = typeof window === 'undefined' ? 'NodeJS' : 'Browser';

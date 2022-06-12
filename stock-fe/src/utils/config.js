// export/import => ESM 的模組管理方式
// 設定預設值
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
export const API_URL = BASE_URL + '/api';
export const IMAGE_URL = BASE_URL + '/images';
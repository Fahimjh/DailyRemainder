import API from "./apiInstance";

export const getRandomAyah = async () => {
  const res = await API.get("/ayah/random");
  return res.data;
};

export const addBookmarkServer = async (type: string, data: any, token?: string) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.post("/bookmark/add", { type, data }, config);
  return res.data;
};

export const getBookmarksServer = async (token?: string) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.get("/bookmark", config);
  return res.data;
};

export const getPrayerTimesByCity = async (city: string, country: string) => {
  const url = `/prayer/${encodeURIComponent(city)}/${encodeURIComponent(country)}`;
  const res = await API.get(url);
  return res.data; // Aladhan response forwarded by backend
};

// NEW: save tasbih count
export const saveTasbihCount = async (userId: string, count: number, token?: string) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.post("/tasbih/save", { userId, count }, config);
  return res.data;
};

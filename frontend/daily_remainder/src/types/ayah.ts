export interface Ayah {
  arabic: string;
  translation_bn?: string;
  surah_bn?: string;
  surah_ar?: string;
  surah_en?: string;
  number?: number;
  reference_bn?: string;
  reference_en?: string;
  reference_ar?: string;
}
export interface Bookmark {
  _id?: string;
  type: string;
  data: any;
  createdAt?: string;
}

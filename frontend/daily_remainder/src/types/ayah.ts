export interface Ayah {
  arabic: string;
  translation_bn?: string;
  surah_bn?: string;
  surah_ar?: string;
  number?: number;
  reference_bn?: string;
}
export interface Bookmark {
  _id?: string;
  type: string;
  data: any;
  createdAt?: string;
}

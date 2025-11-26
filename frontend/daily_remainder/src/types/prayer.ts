export interface Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
}

export interface PrayerResponse {
  code: number;
  status: string;
  data: {
    timings: Timings;
    date: {
      readable: string;
      timestamp: string;
      gregorian?: any;
      hijri?: any;
    };
    meta?: any;
  };
}

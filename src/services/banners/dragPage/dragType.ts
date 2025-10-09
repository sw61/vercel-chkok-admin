export interface BannerData {
  id: number;
  title: string;
  bannerUrl: string;
  redirectUrl: string;
  description: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  displayOrder: number;
}

export interface CreateBannerResponse {
  bannerUrl: string;
  redirectUrl: string;
  title: string;
  description: string;
  position: string;
  displayOrder?: number;
}

export interface UpdateBannerResponse {
  id: number;
  displayOrder: number;
}

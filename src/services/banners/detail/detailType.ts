export interface ApiResponse {
  bannerUrl: string;
  redirectUrl: string;
  title: string;
  description: string;
  position: string;
  displayOrder?: number;
}
export interface EditBannerParams {
  id: string;
  payload: {
    title: string;
    bannerUrl: string;
    redirectUrl: string;
    description: string;
    position: string;
    displayOrder: number;
  };
}

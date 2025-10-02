export interface FormData {
  title?: string;
  content?: string;
  active?: boolean;
  campaignId?: string;
  contactPhone: string;
  homepage: string;
  businessAddress: string;
  businessDetailAddress: string;
  lat?: number;
  lng?: number;
}
export interface EditResponse {
  title?: string;
  content?: string;
  active?: boolean;
  campaignId?: string;
  visitInfo?: {
    contactPhone: string | null;
    homepage?: string | null;
    businessAddress?: string | null;
    businessDetailAddress?: string | null;
    lat?: number | null;
    lng?: number | null;
  };
}

export interface EditParams {
  id: string;
  payload: {
    title?: string;
    content?: string;
    visitInfo?: {
      contactPhone: string | null;
      homepage?: string | null;
      businessAddress?: string | null;
      businessDetailAddress?: string | null;
      lat?: number | null;
      lng?: number | null;
    };
  };
}
export interface DetailResponse {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  campaignId: string;
  authorId: number;
  authorName: string;
  active: boolean;
  visitInfo: {
    contactPhone: string | null;
    homepage: string | null;
    businessAddress?: string | null;
    businessDetailAddress?: string | null;
    lat: number | null;
    lng: number | null;
  };
  createdAt: string;
  updatedAt: string;
}
export interface CreateParams {
  title?: string;
  content?: string;
  active?: boolean;
  visitInfo?: {
    contactPhone: string | null;
    homepage?: string | null;
    businessAddress?: string | null;
    businessDetailAddress?: string | null;
    lat?: number | null;
    lng?: number | null;
  };
}

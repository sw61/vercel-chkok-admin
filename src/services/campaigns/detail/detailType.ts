// 캠페인 상세 페이지 데이터 타입
export interface Campaign {
  id: number;
  title: string;
  campaignType: '블로그' | '인스타그램' | '유튜브' | '틱톡';
  thumbnailUrl: string;
  productShortInfo: string; // 제품 간단 정보
  productDetails: string; // 제품 상세 정보
  maxApplicants: number; // 최대 신청자 수
  recruitmentStartDate: string; // 모집 시작일
  recruitmentEndDate: string; // 모집 마감일
  applicationDeadlineDate: string; // 리뷰 마감일
  selectionDate: string; // 체험단 선정일
  reviewDeadlineDate: string; // 리뷰 마감일
  approvalStatus: '승인됨' | '대기중' | '거절됨';
  approvalComment: string;
  approvalDate: string;
  createdAt: string;
  creatorRole: '클라이언트' | '사용자' | '관리자';
  creatorAccountType: string;
  selectionCriteria: string;
  isAlwaysOpen: boolean;
  category: {
    type: string;
    name: string;
  };
  creator: {
    id: number;
    nickname: string;
    email: string;
    role: string;
    accountType: string;
  };
  approver: {
    id: number;
    email: string;
    nickname: string;
  };
  company: {
    id: number;
    companyName: string;
    businessRegistrationNumber: string;
    contactPerson: string;
    phoneNumber: string;
  };
  location: {
    id: number;
    latitude: number;
    longitude: number;
    businessAddress: string;
    businessDetailAddress: string;
    homepage: string;
    contactPhone: string;
    visitAndReservationInfo: string;
    hasCoordinates: boolean;
  };
  missionInfo: {
    id: number;
    titleKeywords: string[];
    bodyKeywords: string[];
    numberOfVideo: number;
    numberOfImage: number;
    numberOfText: number;
    isMap: boolean;
    missionGuide: string;
    missionStartDate: string;
    missionDeadlineDate: string;
    createdAt: string;
    updatedAt: string;
  };
}
// component props
export interface DetailMissionProps {
  campaignData: Campaign;
}
export interface DetailContentProps {
  campaignData: Campaign;
}
//
export interface DetailHeaderProps {
  campaignData: Campaign;
  campaignId: string;
}
// Mutation props
export interface ApproveProps {
  id: string;
  comment: string;
}
export interface UpdateCampaignProps {
  id: string;
  payload: UpdateCampaign;
}
// 캠페인 수정 payload type
export interface UpdateCampaign {
  title: string;
  campaignType: string;
  thumbnailUrl: string;
  productShortInfo: string;
  recruitmentStartDate: string;
  recruitmentEndDate: string;
  selectionDate: string;
  selectionCriteria: string;
  location: {
    latitude: number;
    longitude: number;
    businessAddress: string;
    businessDetailAddress: string;
    homepage: string;
    contactPhone: string;
    visitAndReservationInfo: string;
  };
  missionInfo: {
    titleKeywords: string[];
    bodyKeywords: string[];
    numberOfVideo: number;
    numberOfImage: number;
    numberOfText: number;
    missionGuide: string;
    missionStartDate: string;
    missionDeadlineDate: string;
  };
}
export type CampaignFormData = Omit<Campaign, 'missionInfo'> & {
  missionInfo: Omit<
    Campaign['missionInfo'],
    'titleKeywords' | 'bodyKeywords'
  > & {
    titleKeywords: string; // 폼은 문자열을 받음
    bodyKeywords: string; // 폼은 문자열을 받음
  };
};

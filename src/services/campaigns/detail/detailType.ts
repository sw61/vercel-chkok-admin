import type { ChangeEvent } from 'react';

export interface ApproveProps {
  id: string;
  comment: string;
}

export interface Campaign {
  id: number;
  title: string;
  campaignType: '블로그' | '인스타그램' | '유튜브' | '틱톡';
  thumbnailUrl: string;
  productShortInfo: string;
  maxApplicants: number;
  recruitmentStartDate: string;
  recruitmentEndDate: string;
  applicationDeadlineDate: string;
  selectionDate: string;
  reviewDeadlineDate: string;
  approvalStatus: '승인됨' | '대기중' | '거절됨';
  approvalComment: string;
  approvalDate: string;
  createdAt: string;
  creatorRole: '클라이언트' | '사용자' | '관리자';
  creatorAccountType: string;
  selectionCriteria: string;
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
export interface DetailMissionProps {
  campaignData: Campaign;
}
export interface DetailContentProps {
  campaignData: Campaign;
}
export interface DetailHeaderProps {
  campaignData: Campaign;
  campaignId: string;
}

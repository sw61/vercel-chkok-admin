import { UserDataTable } from './UserDataTable';
import { PaginationDemo } from './Pagination';
import axiosInterceptor from '@/lib/axios-interceptors';
import { useState, useEffect } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

interface User {
  id: number;
  name: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

interface PaginationData {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export default function UserTablePage() {
  const [userData, setUserData] = useState<User[]>();
  const [pageData, setPageData] = useState<PaginationData | null>();

  const getUserTable = async (page: number = 0) => {
    try {
      const response = await axiosInterceptor.get(`/users?page=${page}&size=5`);
      const userData = response.data.data;
      setUserData(userData.content);
      setPageData(userData.pagination);
    } catch (error) {
      console.log(error);
      alert(`${error}`);
    }
  };
  useEffect(() => {
    getUserTable();
  }, []);
  if (!userData || !pageData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    getUserTable(page);
  };

  return (
    <>
      <UserDataTable userData={userData} />
      <PaginationDemo pageData={pageData} onPageChange={handlePageChange} />
    </>
  );
}

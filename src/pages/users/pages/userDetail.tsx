import { Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import UserDetailSkeleton from '@/pages/users/components/detail/usersDetailSkeleton';
import ActivitiesPage from '../components/activities/table/activitiesPage';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserDetail } from '@/services/users/detail/detailApi';
import UserDetailHeader from '../components/detail/detailHeader';
import UserDetailContent from '../components/detail/detailContent';

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  // 사용자 상세 정보 요청
  const { data: userData } = useSuspenseQuery({
    queryKey: ['userDetail', userId],
    queryFn: () => getUserDetail(userId!),
  });

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <div className="min-w-[650px] px-6 py-4">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ChevronLeft
              onClick={() => navigate('/users')}
              className="cursor-pointer"
            />
          </div>
          <Card>
            <CardContent>
              {/* 상세 페이지 헤더 부분 */}
              <UserDetailHeader userId={userId!} userData={userData} />
              {/* 상세 페이지 메인 컨텐츠 부분 */}
              <UserDetailContent userId={userId!} userData={userData} />
            </CardContent>
          </Card>
          {userData.role === '관리자' ? <></> : <ActivitiesPage />}
        </div>
      </div>
    </Suspense>
  );
}

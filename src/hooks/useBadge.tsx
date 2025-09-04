import { Badge } from '@/components/ui/badge';

// 서버에서 오는 값 타입
type ServerPlatform =
  | '블로그'
  | '인스타그램'
  | '유튜브'
  | '틱톡'
  | '사용자'
  | '클라이언트'
  | '관리자'
  | '승인됨'
  | '대기중'
  | '거절됨';

// Badge variant 타입 (shadcn 기본)
type BadgeVariant =
  | '블로그'
  | '인스타그램'
  | '유튜브'
  | '틱톡'
  | '사용자'
  | '클라이언트'
  | '관리자'
  | '승인됨'
  | '대기중'
  | '거절됨';

// 매핑 객체
const variantMap: Record<ServerPlatform, BadgeVariant> = {
  블로그: '블로그',
  인스타그램: '인스타그램',
  유튜브: '유튜브',
  틱톡: '틱톡',
  사용자: '사용자',
  클라이언트: '클라이언트',
  관리자: '관리자',
  승인됨: '승인됨',
  대기중: '대기중',
  거절됨: '거절됨',
};

interface Props {
  variant: ServerPlatform;
}

export function CustomBadge({ variant }: Props) {
  return <Badge variant={variantMap[variant]}>{variant}</Badge>;
}

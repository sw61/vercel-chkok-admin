import blogIcon from '@/image/blog.svg';
import instagramIcon from '@/image/instagram.svg';
import youtubeIcon from '@/image/youtube.svg';
import type { PlatformLinksProps } from '@/services/users/detail/detailType';

const platformImageMap: Record<string, string> = {
  blog: blogIcon,
  instagram: instagramIcon,
  youtube: youtubeIcon,
};

const PlatformLinks: React.FC<PlatformLinksProps> = ({ platformsData }) => {
  const getPlatformImage = (platformType: string): string => {
    return platformImageMap[platformType];
  };

  return (
    <div className="flex items-center gap-2">
      {platformsData?.map((platform) => (
        <a key={platform.id} href={platform.accountUrl} target="_blank">
          <img
            src={getPlatformImage(platform.platformType)}
            alt={`${platform.platformType} 아이콘`}
            className="h-6 w-6 cursor-pointer rounded-sm"
          />
        </a>
      ))}
    </div>
  );
};

export default PlatformLinks;

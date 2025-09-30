import { useKakaoLoader as useKakaoLoaderBase } from 'react-kakao-maps-sdk';

const useKakaoLoader = () => {
  return useKakaoLoaderBase({
    appkey: import.meta.env.VITE_KAKAOMAP_API_KEY as string,
    libraries: ['clusterer', 'drawing', 'services'],
  });
};

export default useKakaoLoader;

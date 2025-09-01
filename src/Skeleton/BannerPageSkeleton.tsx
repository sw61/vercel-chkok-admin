import { Skeleton } from "@/components/ui/skeleton";

const BannerPageSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="flex w-full flex-col rounded-xl border bg-white px-4 py-2"
        >
          <div className="flex items-center">
            <Skeleton className="h-36 w-64 rounded-md" />
            <div className="flex w-full items-center justify-between p-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-10 w-12 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BannerPageSkeleton;

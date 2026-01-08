import Link from "next/link";
import Image from "next/image";

const BASE_URL = "http://localhost:8080";

async function getExhibitions() {
  try {
    const res = await fetch(`${BASE_URL}/exhibition/all`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getPhotos() {
  try {
    const res = await fetch(`${BASE_URL}/photo/all`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const [exhibitions, photos] = await Promise.all([getExhibitions(), getPhotos()]);

  return (
    <main className="min-h-screen bg-white pt-20 font-bold">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center border-b border-gray-100 bg-gray-50/50">
        <h1 className="text-4xl font-black mb-4 tracking-tighter text-gray-900">
          ARCHIVE OF VISION
        </h1>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          Discover creative perspectives and exhibitions
        </p>
      </section>

      {/* 전시회 섹션 */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-black text-gray-900 uppercase">Exhibitions</h2>
          <span className="text-gray-300 text-sm">/ {exhibitions.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {exhibitions.slice(0, 6).map((ex: any, index: number) => (
            <Link
              key={ex.exhibitionId}
              href={`/exhibition/${ex.exhibitionId}`}
              as={`/exhibition/${ex.exhibitionId}`}
            >
              {/* group 클래스로 호버 상태 감지 */}
              <div className="group cursor-pointer relative aspect-[16/10] overflow-hidden rounded-none border border-gray-50 bg-gray-50">
                {ex.photos?.[0] && (
                  <Image
                    src={ex.photos[0].imageUrl}
                    alt={ex.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index < 3}
                    className="object-cover"
                  />
                )}
                {/* [수정] 평소엔 투명(opacity-0), 호버 시 등장(group-hover:opacity-100) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                  <h3 className="font-black text-1g text-white tracking-tight">{ex.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="h-px bg-gray-100 w-full" />
      </div>

      {/* 사진 섹션 */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-black text-gray-900 uppercase">Latest Shots</h2>
          <span className="text-gray-300 text-sm">/ Explore all</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {photos.map((photo: any) => (
            <Link
              key={photo.photoId}
              href={`/photo/${photo.photoId}`}
              as={`/photo/${photo.photoId}`}
            >
              <div className="group relative aspect-square overflow-hidden rounded-none bg-gray-100 border border-gray-50">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover"
                />
                {/* [수정] 사진 그리드도 동일하게 호버 시에만 제목 노출 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-[11px] font-black tracking-widest uppercase">
                    {photo.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 border-t border-gray-100 text-center">
        <p className="text-gray-300 text-[10px] tracking-[0.2em] uppercase">
          © 2024 Your Gallery. All rights reserved.
        </p>
      </section>
    </main>
  );
}

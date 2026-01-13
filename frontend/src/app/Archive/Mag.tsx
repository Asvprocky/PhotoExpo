import Link from "next/link";
import Image from "next/image";

const BASE_URL = "http://localhost:8080";

// 데이터 페칭 함수는 동일하게 유지
async function getExhibitions() {
  try {
    const res = await fetch(`${BASE_URL}/exhibition/all`, { next: { tags: ["exhibition"] } });
    return res.ok ? res.json() : [];
  } catch (error) {
    return [];
  }
}

async function getPhotos() {
  try {
    const res = await fetch(`${BASE_URL}/photo/all`, { next: { tags: ["photos"] } });
    return res.ok ? res.json() : [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const [exhibitions, photos] = await Promise.all([getExhibitions(), getPhotos()]);

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-black selection:text-white">
      {/* --- HERO SECTION: 잡지 커버 느낌 --- */}
      <section className="relative h-[70vh] flex flex-col justify-center items-center px-6 border-b border-black/5 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3仿真%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <p className="text-[10px] tracking-[0.5em] uppercase mb-8 animate-fade-in">
          Established 2026 / PhotoExpo Archive
        </p>
        <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase text-center italic underline-offset-8">
          Archive
          <br />
          Of Vision
        </h1>
        <div className="mt-12 flex gap-20 text-[11px] font-medium uppercase tracking-widest text-gray-500">
          <span>Curated perspectives</span>
          <span>Seoul, KR</span>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* --- EXHIBITIONS: 비대칭 그리드 레이아웃 --- */}
      <section className="max-w-[1600px] mx-auto px-6 py-32">
        <div className="flex items-baseline justify-between mb-20 border-b border-black pb-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter italic">Exhibitions</h2>
          <span className="font-mono text-sm">
            INDEX(01) — ({exhibitions.length.toString().padStart(2, "0")})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 gap-x-12">
          {exhibitions.map((ex: any, idx: number) => {
            // 인덱스에 따라 카드 너비를 다르게 배치 (비대칭 디자인)
            const colSpan = idx % 3 === 0 ? "md:col-span-8" : "md:col-span-4";
            const isPriority = idx < 2;

            return (
              <div key={ex.exhibitionId} className={`${colSpan} group relative`}>
                <Link href={`/exhibition/${ex.exhibitionId}`}>
                  <div className="relative aspect-[16/11] overflow-hidden bg-gray-200">
                    {ex.photos?.[0] && (
                      <Image
                        src={ex.photos[0].imageUrl}
                        alt={ex.title}
                        fill
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                        priority={isPriority}
                      />
                    )}
                    {/* 오버레이 디자인 수정 */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-white border border-white px-6 py-2 text-xs uppercase tracking-widest backdrop-blur-sm">
                        View Series
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-start font-bold">
                    <div>
                      <span className="text-[10px] text-gray-400 mb-1 block uppercase tracking-tighter">
                        No. {idx + 1}
                      </span>
                      <h3 className="text-xl uppercase tracking-tighter leading-none">
                        {ex.title}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400 italic">2026</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- LATEST SHOTS: 밀도 높은 컨택트 시트 느낌 --- */}
      <section className="bg-black text-white py-32">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-baseline justify-between mb-16 border-b border-white/20 pb-4">
            <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white">
              Latest Shots
            </h2>
            <button className="text-[11px] uppercase tracking-[0.3em] hover:text-blue-400 transition-colors">
              See all Collection →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((photo: any, idx: number) => (
              <Link
                key={photo.photoId}
                href={`/photo/${photo.photoId}`}
                className="group relative aspect-square overflow-hidden bg-neutral-900"
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="bg-white text-black text-[9px] px-2 py-1 font-black uppercase">
                    {photo.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 text-center flex flex-col items-center gap-6">
        <div className="w-12 h-[1px] bg-black"></div>
        <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">
          PhotoExpo © 2026 / All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}

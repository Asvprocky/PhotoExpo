import Link from "next/link";
import Image from "next/image";

const BASE_URL = "http://localhost:8080";

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
      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] flex flex-col justify-center items-center px-6 border-b border-black/5 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <p className="text-[9px] tracking-[0.6em] uppercase mb-10 text-neutral-400 font-medium">
          Seoul / Digital Archive 2026
        </p>
        <h1 className="text-[10vw] leading-[0.9] font-light tracking-tighter uppercase text-center italic font-serif">
          Archive
          <br />
          <span className="not-italic font-sans font-medium tracking-tight">Of Vision</span>
        </h1>
        <div className="mt-16 flex gap-16 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
          <span>Selected Work</span>
          <span className="opacity-30">/</span>
          <span>Curated List</span>
        </div>
      </section>

      {/* --- EXHIBITIONS --- */}
      <section className="max-w-[1600px] mx-auto px-6 py-40">
        <div className="flex items-baseline justify-between mb-24 border-b border-black/10 pb-6">
          <h2 className="text-xl font-medium uppercase tracking-[0.3em] italic">Exhibitions</h2>
          <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
            Catalog No. 01 — {exhibitions.length.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
          {exhibitions.map((ex: any, idx: number) => (
            <div key={ex.exhibitionId} className="group relative">
              <Link href={`/exhibition/${ex.exhibitionId}`}>
                <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100 shadow-sm transition-all duration-700 group-hover:shadow-xl">
                  {ex.photos?.[0] && (
                    <Image
                      src={ex.photos[0].imageUrl}
                      alt={ex.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03] grayscale-[0.2] group-hover:grayscale-0"
                      priority={idx < 3}
                    />
                  )}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                    <span className="text-black bg-white/90 px-6 py-3 text-[9px] uppercase tracking-[0.4em] backdrop-blur-sm">
                      VIEW
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-[8px] text-neutral-400 block uppercase tracking-[0.4em]">
                      Series 0{idx + 1}
                    </span>
                    <h3 className="text-lg font-normal uppercase tracking-tight text-neutral-800">
                      {ex.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-neutral-300 font-serif italic">2026</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- LATEST STREAM: Minimalist Archive Edition --- */}
      <section className="bg-white py-60 px-6 border-t border-neutral-100">
        <div className="max-w-[1400px] mx-auto">
          {/* 섹션 헤더: 극도의 절제미 */}
          <div className="flex flex-col items-center mb-40 text-center">
            <span className="text-[9px] tracking-[0.8em] text-neutral-400 uppercase mb-4">
              Index / Selected Pieces
            </span>
            <div className="w-px h-12 bg-black opacity-20" />
          </div>

          {/* 그리드: 정갈한 3컬럼 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
            {photos.map((photo: any, idx: number) => (
              <Link
                key={photo.photoId}
                href={`/photo/${photo.photoId}`}
                className="group block relative"
              >
                <div className="flex flex-col">
                  {/* 01. 이미지 영역: 선명하고 깨끗한 배치 */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50 border border-neutral-100 transition-all duration-700 group-hover:shadow-2xl">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      /* fill 대신 <img> 태그와 w-full 사용 (비율 유지 최적화) */
                      className="w-full h-full object-cover opacity-100 transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                    />
                    {/* 이미지 안쪽 미세한 테두리 (고급스러운 마감) */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/[0.03] pointer-events-none" />
                  </div>

                  {/* 02. 정보 영역: 텍스트 최소화 */}
                  <div className="mt-8 px-1 flex justify-between items-baseline">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-serif italic text-neutral-300">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800 transition-colors group-hover:text-black">
                        {photo.title}
                      </h3>
                    </div>

                    <span className="text-[9px] tracking-widest text-neutral-200 uppercase font-medium">
                      ©2026
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 하단 네비게이션: motion 대신 순수 CSS로 구현 */}
          <div className="mt-60 flex justify-center">
            <Link href="/photos" className="group flex flex-col items-center gap-4">
              <span className="text-[9px] tracking-[0.6em] uppercase text-neutral-400 group-hover:text-black transition-colors duration-500">
                View All Archive
              </span>
              {/* 호버 시 선이 길어지는 CSS 애니메이션 */}
              <div className="w-8 h-[1px] bg-black opacity-20 transition-all duration-700 group-hover:w-20 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 text-center flex flex-col items-center gap-8 border-t border-black/[0.03]">
        <div className="font-serif italic text-xl tracking-tighter opacity-60">PhotoExpo.</div>
        <div className="flex gap-8 text-[8px] tracking-[0.5em] uppercase text-neutral-400">
          <span>Privacy</span>
          <span>Archive</span>
          <span>Contact</span>
        </div>
        <p className="text-[8px] tracking-[0.3em] uppercase opacity-20 mt-4">
          © 2026 PHOTOEXPO ARCHIVE.
        </p>
      </footer>
    </main>
  );
}

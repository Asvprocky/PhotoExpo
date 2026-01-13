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
    <main className="min-h-screen bg-[#fcfaf7] text-[#1a1a1a] overflow-x-hidden">
      {/* --- HERO SECTION: 캔버스 위에 떠 있는 듯한 타이포그래피 --- */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute top-20 left-10 text-[10px] tracking-[0.8em] uppercase mix-blend-difference opacity-50">
          PhotoExpo / Edition 2026
        </div>

        <div className="z-10 text-center">
          <h1 className="text-[15vw] font-light tracking-tighter leading-none mb-4 italic font-serif">
            Archive
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="w-20 h-px bg-current opacity-30" />
            <p className="text-xs uppercase tracking-[0.4em] font-medium">In Every Pixel</p>
            <div className="w-20 h-px bg-current opacity-30" />
          </div>
        </div>

        {/* 배경에 은은하게 깔리는 큰 이미지 (첫 번째 전시회) */}
        <div className="absolute right-[5%] top-[15%] w-[30vw] aspect-[3/4] opacity-20 grayscale pointer-events-none">
          {exhibitions[0]?.photos?.[0] && (
            <Image src={exhibitions[0].photos[0].imageUrl} alt="bg" fill className="object-cover" />
          )}
        </div>
      </section>

      {/* --- EXHIBITIONS: 레이어드 디자인 (Layered Overlap) --- */}
      <section className="max-w-[1600px] mx-auto px-6 py-40">
        {exhibitions.map((ex: any, idx: number) => (
          <div key={ex.exhibitionId} className="relative mb-80 group">
            {/* 배경에 깔리는 큰 인덱스 번호 */}
            <span className="absolute -top-20 -left-10 text-[20vw] font-black text-gray-100/50 select-none z-0">
              0{idx + 1}
            </span>

            <div
              className={`flex flex-col ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-end relative z-10`}
            >
              {/* 이미지 박스: 묘하게 어긋난 레이아웃 */}
              <Link
                href={`/exhibition/${ex.exhibitionId}`}
                className="relative w-full md:w-3/5 aspect-[16/10] overflow-hidden shadow-2xl transition-transform duration-1000 group-hover:scale-[1.01]"
              >
                <Image
                  src={ex.photos?.[0]?.imageUrl}
                  alt={ex.title}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
              </Link>

              {/* 텍스트 박스: 이미지 위에 살짝 얹혀진 느낌 */}
              <div
                className={`w-full md:w-2/5 p-12 md:-ml-20 md:-mb-12 bg-white/80 backdrop-blur-md z-20 shadow-sm border border-white/50 ${
                  idx % 2 === 0 ? "md:-ml-20" : "md:-mr-20"
                }`}
              >
                <h3 className="text-3xl font-serif italic mb-4">{ex.title}</h3>
                <p className="text-xs text-gray-400 leading-loose tracking-widest uppercase mb-8">
                  A curated collection of visual storytelling through the lens of modern art.
                </p>
                <Link
                  href={`/exhibition/${ex.exhibitionId}`}
                  className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase border-b border-black pb-2 hover:opacity-50 transition-all"
                >
                  View Exhibition
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* --- LATEST SHOTS: 자유로운 배열 (Floating Masonry) --- */}
      <section className="bg-white py-40 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center mb-32">
            <h2 className="text-4xl font-serif italic mb-2 tracking-tighter">Latest Pieces</h2>
            <div className="w-12 h-px bg-gray-200" />
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 space-y-12">
            {photos.map((photo: any, idx: number) => (
              <Link
                key={photo.photoId}
                href={`/photo/${photo.photoId}`}
                className={`block relative break-inside-avoid group ${
                  idx % 2 === 0 ? "pt-20" : ""
                }`}
              >
                <div className="relative overflow-hidden transition-all duration-700">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
                  />
                  {/* 사진 설명 (캡션) */}
                  <div className="mt-4 flex justify-between items-baseline">
                    <span className="text-[9px] tracking-widest text-gray-400 font-bold uppercase">
                      {photo.title}
                    </span>
                    <span className="text-[10px] italic font-serif">#0{idx + 1}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 bg-[#fcfaf7] border-t border-gray-100 text-center">
        <div className="font-serif italic text-3xl mb-8">PhotoExpo.</div>
        <div className="flex justify-center gap-10 text-[10px] tracking-[0.3em] uppercase opacity-40 mb-10">
          <span>Instagram</span>
          <span>Contact</span>
          <span>Legal</span>
        </div>
        <p className="text-[9px] tracking-[0.2em] opacity-30">© 2026 ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}

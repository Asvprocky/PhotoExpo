import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <h1>
        <Link href="/exhibition">Exhibition</Link>
        <Link href="/create">프로젝트 생성</Link>
      </h1>
    </div>
  );
}

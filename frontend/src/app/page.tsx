import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <h1>
        <Link href="/users">Users</Link>
      </h1>
      <h1>
        <Link href="/exhibition">Exhibition</Link>
      </h1>
    </div>
  );
}

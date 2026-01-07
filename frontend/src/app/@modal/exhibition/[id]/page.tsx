import ExhibitionDetail from "@/app/exhibition/[id]/page"; // 기존 페이지 컴포넌트 재사용
import Modal from "@/components/modal";

export default async function ExhibitionModalPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Modal>
      {/* 기존에 만드신 ExhibitionDetail 컴포넌트를 그대로 렌더링합니다. 
        만약 ExhibitionDetail이 서버 컴포넌트라면 params를 그대로 전달하세요.
      */}
      <ExhibitionDetail params={params} />
    </Modal>
  );
}

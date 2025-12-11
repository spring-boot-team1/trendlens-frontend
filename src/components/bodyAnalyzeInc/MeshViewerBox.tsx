// src/components/bodyAnalyzeInc/MeshViewerBox.tsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Ring90Icon } from "@/components/ui/icons/Ring90Icon";
import { EllipsisIcon } from "../ui/icons/lucide-ellipsis";

type MeshViewerBoxProps = {
  meshUrl?: string;
  isLoading: boolean; // ✅ 백엔드 로딩 상태
};

export default function MeshViewerBox({ meshUrl, isLoading }: MeshViewerBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isObjLoading, setIsObjLoading] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !meshUrl) return;

    setIsObjLoading(true);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // ---- 기본 three.js 세팅 ----
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.up.set(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.borderRadius = "2rem";

    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.75;

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(-3, -2, -2);
    scene.add(backLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const group = new THREE.Group();
    scene.add(group);

    // ---- OBJ 로드 ----
    const loader = new OBJLoader();
    loader.load(
      meshUrl,
      (obj) => {
        // 1) 박스 기준으로 중앙 정렬 & 스케일 통일
        const box = new THREE.Box3().setFromObject(obj);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // 중심을 (0, 0, 0)으로 이동
        obj.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetHeight = 2; // 화면 안에 꽉 차는 정도의 높이
        const scale = targetHeight / maxDim;
        obj.scale.setScalar(scale);

        // 2) 방향 보정
        //    - SAM3D가 일관되게 "어느 축이 앞/위"인지에 따라 다르긴 한데
        //    - 우선 y축만 180도 돌려서 "등 대신 정면" 보게 맞춰둔다고 가정
        obj.rotation.set(Math.PI, 0, 0);
        // 만약 정면이 반대로 보이면 Math.PI → 0 으로 바꾸면 됨
        // 혹시 약간 옆을 본다면 Math.PI / 2, -Math.PI / 2 이런 식으로 조절

        group.add(obj);

        // 3) 회전/스케일 적용 이후의 박스 기준으로 카메라/타겟 재조정
        const finalBox = new THREE.Box3().setFromObject(group);
        const finalSize = new THREE.Vector3();
        const finalCenter = new THREE.Vector3();
        finalBox.getSize(finalSize);
        finalBox.getCenter(finalCenter);

        // 카메라가 모델을 정면에서 약간 위쪽에서 내려다보게 배치
        const maxFinalDim = Math.max(finalSize.x, finalSize.y, finalSize.z);
        const distance = maxFinalDim * 1.6; // 숫자 키우면 더 멀어지고, 줄이면 더 가까워짐
        camera.position.set(
          finalCenter.x,
          finalCenter.y + finalSize.y * 0.1, // 살짝 위에서 보도록
          finalCenter.z + distance
        );

        controls.target.copy(finalCenter);
        controls.update();

        setIsObjLoading(false);
      },
      undefined,
      (error) => {
        console.error("❌ OBJ 로드 실패:", error);
        setIsObjLoading(false);
      }
    );

    let frameId: number;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [meshUrl]);

  const showSpinner = isLoading || isObjLoading;

  return (
    <div
      ref={containerRef}
      className={
        meshUrl
          ? "relative w-[400px] h-[750px] rounded-4xl bg-[#111827] border border-gray-700"
          : "relative w-[400px] h-[750px] rounded-4xl bg-white border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500"
      }
    >
      {/* 아직 meshUrl 없고 로딩도 없을 때 → 안내 문구 */}
      {!meshUrl && !showSpinner && (
        <span className="text-center leading-relaxed">
          <EllipsisIcon />
        </span>
      )}

      {/* 백엔드 요청 중 + OBJ 로드 중 둘 다 여기에서 공통으로 처리 */}
      {showSpinner && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/5 rounded-3xl">
          <Ring90Icon size={38} color="#6A7282" strokeWidth={1.6} />
          <span className="text-xs text-gray-500">체형을 분석하는 중입니다...</span>
        </div>
      )}
    </div>
  );
}

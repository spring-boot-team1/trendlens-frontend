// src/components/bodyAnalyzeInc/MeshViewerBox.tsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Ring90Icon } from "@/components/ui/icons/Ring90Icon"
import { EllipsisIcon } from "../ui/icons/lucide-ellipsis";

type MeshViewerBoxProps = {
    meshUrl?: string;
    isLoading: boolean; // ✅ 백엔드 로딩 상태
};

export default function MeshViewerBox({ meshUrl, isLoading }: MeshViewerBoxProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isObjLoading, setIsObjLoading] = useState(false);

    // OBJ 로딩 + three.js 세팅
    useEffect(() => {
        // meshUrl 없으면 three.js 세팅 안 함
        if (!containerRef.current || !meshUrl) return;

        setIsObjLoading(true); // ✅ OBJ 로드 시작

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 1.6, 3);
        camera.lookAt(0, 1.2, 0);
        camera.up.set(0, 1, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true, // 부모 배경색 보이게
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

        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambient);

        const group = new THREE.Group();
        scene.add(group);

        const loader = new OBJLoader();
        loader.load(
            meshUrl,
            (obj) => {
                const box = new THREE.Box3().setFromObject(obj);
                const size = new THREE.Vector3();
                const center = new THREE.Vector3();
                box.getSize(size);
                box.getCenter(center);

                obj.position.sub(center);

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                obj.scale.setScalar(scale);

                // 필요하면 여기서 한번 자세 회전 조정
                // obj.rotation.x = -Math.PI / 2;
                // obj.rotation.y = Math.PI;

                group.add(obj);
                setIsObjLoading(false); // ✅ OBJ 로드 완료
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
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/5">
                    <Ring90Icon size={44} color="#4B5563" strokeWidth={1.6} />
                    <span className="text-xs text-gray-500">체형을 분석하는 중입니다...</span>
                </div>
            )}
        </div>
    );
}

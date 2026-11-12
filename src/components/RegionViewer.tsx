import React, { useState, useEffect, FC } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds, useBounds } from "@react-three/drei";

import { creaBricks } from "../utils/mainfile";
import { crea_regioni } from "../utils/crea_regioni";
import {
  genera_mesh,
  Superfici,
  Volumi,
  IncidenceSelection,
  Escalings,
} from "../utils/genera_mesh";
import { Material, Region } from "../utils/interfaces";

import { Parallelepipedo } from "./Parallelepipedo";
import { MeshViewer } from "./MeshViewer";
import { InstancedSquaresFromVertices } from "./RisMesh";

interface BoxData {
  center: [number, number, number];
  size: [number, number, number];
  color: string;
}

interface MeshDataType {
  incidence_selection: IncidenceSelection;
  volumi: Volumi;
  superfici: Superfici;
  nodi_coord: number[][];
  escalings: Escalings;
}

export function RegionViewer() {
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [regioni, setRegioni] = useState<Region | null>(null);
  const [den, setDen] = useState(10);
  const [showMeshControls, setShowMeshControls] = useState(false);
  const [meshData, setMeshData] = useState<null | MeshDataType>(null);
  const [instancedMesh, setInstancedMesh] = useState(false);

  const toggleInstancedMesh = () => setInstancedMesh(!instancedMesh);

  // Caricamento file JSON
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const text = await file.text();
    const data = JSON.parse(text);

    // Estrazione dei materials
    let materials: Material[] = [];
    if (Array.isArray(data.materials)) {
      materials = data.materials;
    } else {
      materials = Object.values(data.materials) as Material[];
    }

    // Creazione di bricks e regioni
    const { bricks, bricks_material } = creaBricks(
      data.bricksMatrix,
      data.bricksMaterials
    );
    const regioniLocal = crea_regioni(bricks, bricks_material, materials);
    setRegioni(regioniLocal);

    // Calcolo dei box per la vista 3D
    const newBoxes: BoxData[] = regioniLocal.coordinate.map((coord) => {
      const xs: number[] = [];
      const ys: number[] = [];
      const zs: number[] = [];
      for (let i = 0; i < 24; i += 3) {
        xs.push(coord[i]);
        ys.push(coord[i + 1]);
        zs.push(coord[i + 2]);
      }
      const minX = Math.min(...xs),
        maxX = Math.max(...xs);
      const minY = Math.min(...ys),
        maxY = Math.max(...ys);
      const minZ = Math.min(...zs),
        maxZ = Math.max(...zs);

      const w = maxX - minX,
        h = maxY - minY,
        d = maxZ - minZ;
      const cx = minX + w / 2,
        cy = minY + h / 2,
        cz = minZ + d / 2;

      return { center: [cx, cy, cz], size: [w, h, d], color: "#FDF5E6" };
    });

    setBoxes(newBoxes);
    setShowMeshControls(true);
    setMeshData(null);
  }

  // Clic su "Meshing"
  function handleMeshClick() {
    if (!regioni) {
      alert("Prima devi caricare la geometria!");
      return;
    }
    const use_escalings = 1;
    const scalamento = 1e-3;
    const freq_max = 10e9;

    const result = genera_mesh(regioni, den, freq_max, scalamento, use_escalings);
    console.log(
      "genera_mesh -> superfici.estremi_celle.length =",
      result.superfici.estremi_celle?.length
    );
    setMeshData(result);
  }

  return (
    <div style={{ width: "100%", height: "100%", padding: "1em" }}>
      {/* 
        Barra dei controlli su un'unica riga:
          - input file a sinistra
          - controlli mesh a destra
      */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1em",
        }}
      >
        {/* Selezione del file JSON */}
        <div style={{ fontSize: "1.1em" }}>
          <label style={{ marginRight: "10px" }}>Inserisci la geometria:</label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ fontSize: "1em" }}
          />
        </div>

        {/* Controlli di mesh: visibili solo se ho caricato la geometria */}
        {showMeshControls && (
          <div style={{ fontSize: "1.1em" }}>
            <label style={{ marginRight: "10px" }}>Density:</label>
            <input
              type="number"
              value={den}
              onChange={(e) => setDen(parseFloat(e.target.value))}
              style={{ width: "60px", fontSize: "1em" }}
            />
            <button
              onClick={handleMeshClick}
              style={{
                marginLeft: "1em",
                fontSize: "1em",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Meshing
            </button>
            <button
              onClick={toggleInstancedMesh}
              style={{
                marginLeft: "1em",
                fontSize: "1em",
                backgroundColor: instancedMesh ? "#F8961E" : "#1976d2",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              lightView
            </button>
          </div>
        )}
      </div>

      {/* Due canvas uno a fianco all'altro */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "80vh",
          gap: "1em",
        }}
      >
        {/* Canvas delle regioni (sinistra) */}
        <div
          style={{
            flex: 1,
            border: "1px solid black", // bordo nero
            height: "100%",
          }}
        >
          <Canvas
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(to top, #bbbbbb 0%, #ffffff 90%)",
            }}
            camera={{ fov: 60, near: 0.1, far: 10000, position: [10, 10, 10] }}
          >
            <OrbitControls makeDefault />
            <ambientLight intensity={0.7} />
            {/* Luci */}
            <directionalLight position={[500, 500, 500]} intensity={0.9} />
            <directionalLight position={[-500, 200, 500]} intensity={0.4} />
            <directionalLight position={[-500, 500, -500]} intensity={0.3} />

            <gridHelper args={[500, 50]} position={[0, 0, 0]} />

            <Bounds fit clip observe margin={1.2}>
              <group>
                {boxes.map((b, idx) => (
                  <Parallelepipedo
                    key={idx}
                    center={b.center}
                    size={b.size}
                    color={b.color}
                  />
                ))}
              </group>
              <ResetFocusAction
                boxes={boxes}
                meshData={null}
                instancedMesh={instancedMesh}
              />
            </Bounds>
          </Canvas>
        </div>

        {/* Canvas della mesh (destra) */}
        <div
          style={{
            flex: 1,
            border: "1px solid black", // bordo nero
            height: "100%",
          }}
        >
          <Canvas
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(to top, #bbbbbb 0%, #ffffff 90%)",
            }}
            camera={{ fov: 60, near: 0.1, far: 10000, position: [10, 10, 10] }}
          >
            <OrbitControls makeDefault />
            <ambientLight intensity={0.7} />
            {/* Luci */}
            <directionalLight position={[500, 500, 500]} intensity={0.9} />
            <directionalLight position={[-500, 200, 500]} intensity={0.4} />
            <directionalLight position={[-500, 500, -500]} intensity={0.3} />

            <gridHelper args={[500, 50]} position={[0, 0, 0]} />

            <Bounds fit clip observe margin={1.2}>
              <group>
                {meshData ? (
                  instancedMesh ? (
                    <InstancedSquaresFromVertices superfici={meshData.superfici} />
                  ) : (
                    <MeshViewer superfici={meshData.superfici} />
                  )
                ) : null}
              </group>
              {meshData && (
                <ResetFocusAction
                  boxes={[]}
                  meshData={meshData}
                  instancedMesh={instancedMesh}
                />
              )}
            </Bounds>
          </Canvas>
        </div>
      </div>
    </div>
  );
}

const ResetFocusAction: FC<{
  boxes: BoxData[];
  meshData: MeshDataType | null;
  instancedMesh?: boolean;
}> = ({ boxes, meshData, instancedMesh }) => {
  const bounds = useBounds();
  useEffect(() => {
    bounds.refresh().clip().fit();
  }, [boxes, meshData, instancedMesh, bounds]);
  return null;
};

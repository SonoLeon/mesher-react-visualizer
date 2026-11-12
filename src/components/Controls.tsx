import React from "react";

interface ControlsProps {
  den: number;
  setDen: React.Dispatch<React.SetStateAction<number>>;
  showMeshControls: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMeshClick: () => void;
  instancedMeshClick: Function;
  instancedMesh: boolean;
}

export function Controls({
  den,
  setDen,
  showMeshControls,
  onFileChange,
  onMeshClick,
  instancedMeshClick,
  instancedMesh,
}: ControlsProps) {
  return (
    <div style={{ marginBottom: "1em" }}>
      {/* Selezione file JSON */}
      <div style={{ marginBottom: "1em" }}>
        <input type="file" accept=".json" onChange={onFileChange} />
      </div>

      {/* Controlli meshing (visibili solo se ho caricato la geometria) */}
      {showMeshControls && (
        <div>
          <label>Density: </label>
          <input
            type="number"
            value={den}
            onChange={(e) => setDen(parseFloat(e.target.value))}
            style={{ width: "60px" }}
          />
          <button onClick={onMeshClick} style={{ marginLeft: "1em" }}>
            Meshing
          </button>
          <button
            onClick={() => instancedMeshClick()}
            style={{
              backgroundColor: instancedMesh ? "#F8961E" : "initial",
              color: instancedMesh ? "white" : "initial",
            }}
          >
            lightView
          </button>
        </div>
      )}
    </div>
  );
}

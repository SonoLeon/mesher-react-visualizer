

<div align="center">

# 🧊 Mesher React Visualizer

**A 3D meshing algorithm for electromagnetic simulations, ported from MATLAB to the browser.**

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-0.173-000000?logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

</div>

---

## 📖 About

This project is part of a bachelor's thesis:

> **Porting of a 3D meshing algorithm from MATLAB to the browser environment using TypeScript and Three.js**

Meshing is the step of an engineering simulation in which a continuous geometry is split into a set of elementary cells on which numerical computations can run. The original algorithm was written in MATLAB, which ties it to a desktop tool that is hard to share, distribute and integrate into modern cloud workflows.

This project moves the algorithm to a fully web-based ecosystem, providing a **mesher that runs in the browser with no additional installation**.

## ✨ Features

- 🔢 **Mesher in TypeScript**: about 50 MATLAB functions rewritten in TypeScript, reproducing the original behavior with some improvements and adaptations.
- 🧱 **Interactive 3D visualization**: meshes and regions rendered with Three.js and navigable in the browser.
- 🌐 **Zero install for end users**: everything runs client-side.
- 🔌 **Integration ready**: the code has been successfully integrated into a larger professional electromagnetic simulation tool currently under development.

## 🛠️ Tech stack

| Area            | Technology                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Language        | [TypeScript](https://www.typescriptlang.org/)                                                          |
| UI              | [React](https://react.dev/)                                                                            |
| 3D rendering    | [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [drei](https://github.com/pmndrs/drei) |
| Math            | [math.js](https://mathjs.org/) (matrix and linear algebra operations)                                  |
| Build tool      | [Vite](https://vite.dev/)                                                                              |

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes `npm`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SonoLeon/mesher-react-visualizer.git
cd mesher-react-visualizer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Vite prints a local address in the terminal, usually **<http://localhost:5173>**. Open it in your browser to see the app.

### Available scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload             |
| `npm run preview` | Serve the production build locally               |
| `npm run lint`    | Run ESLint                                       |

## 🧪 Test input

The [`examples/`](examples/) folder contains the input geometries used to test the application. At the moment it holds one file:

- [`examples/testPowerBus.json`](examples/testPowerBus.json): a power bus antenna made of a few hundred bricks and a single copper material. It exists to **check that the whole pipeline works** (loading, region creation, meshing and visualization) without preparing your own input.

How to use it:

1. Run `npm run dev` and open the app.
2. Click the file input ("Inserisci la geometria") and select `examples/testPowerBus.json`.
3. The antenna is shown in the left canvas. Set the **Density** and click **Meshing** to generate the mesh in the right canvas.

> ⏱️ **Meshing takes time.** The power bus geometry is complex, so generating its mesh is computationally heavy and may take a while, especially with a high **Density**. The page can look frozen until the computation ends. Lower the density for quicker tests.

### lightView

The **lightView** button switches how the generated mesh is drawn. In the default view every mesh cell is a separate 3D object, which gives a detailed rendering but becomes slow to navigate when the mesh has many cells. With lightView active, all cells are drawn as *instances* of a single shared shape with a simple, unlit material. The mesh is the same, but rotating and zooming stay smooth on large meshes. Click it again to go back to the detailed view.

### Input file format

The geometry is a JSON file with three keys:

| Key               | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `materials`       | List of materials (`sigmar`, `eps_re`, `tan_D`, `mur`)     |
| `bricksMatrix`    | One row per brick: `[xmin, xmax, ymin, ymax, zmin, zmax]`  |
| `bricksMaterials` | 1-based index of the material of each brick                |

## 📁 Project structure

```text
src/
├── main.tsx        # React entry point
├── App.tsx         # Root component
├── components/     # React / Three.js components for visualization
└── utils/          # TypeScript port of the MATLAB meshing functions
    └── mainfile.ts # Entry point of the meshing pipeline
examples/           # Input geometries (JSON) for testing the app
```

## 🎓 Thesis overview

The thesis starts with an overview of engineering simulations and the role of meshing, together with the state of the art. It then analyzes the original MATLAB algorithm and the constraints of the meshing problem, and explains the motivations for porting it to the browser. After presenting the adopted technologies (TypeScript, Three.js and React), it gives a detailed account of the implementation: the translation of the code from MATLAB to TypeScript, with particular attention to debugging, and the development of the web application for interactive visualization.

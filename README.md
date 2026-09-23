# Portfolio

Spatial-desktop portfolio: React + Vite, Tailwind CSS v4, Framer Motion, Lucide.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Personalise

- `src/data/profile.js` holds your name, email, links (including the **LinkedIn URL**, which is still a placeholder) and asset paths.
- `src/data/projects.js` holds the project content and each node's position on the canvas (`pos`, in % of the viewport).
- `public/portrait.jpg` is optional. Add a monochrome portrait and it replaces the generated silhouette automatically.
- `public/resume.pdf` is used by the Resume window's download and open buttons.

## Structure

| Component | Role |
| --- | --- |
| `Canvas` | Desktop hero: backdrop, wordmark, portrait parallax, grain, scattered nodes |
| `FloatingNode` | Draggable, levitating glass icon badge |
| `Dock` | Floating pill dock with neighbour magnification |
| `Window` | Shared glass OS window (traffic lights, Esc/backdrop close, spring transitions) |
| `ProjectModal`, `AboutModal`, `ProjectsExplorer`, `ResumeModal`, `ContactModal` | Window contents |
| `MobileFeed` | Vertical feed under 768px |
| `Cursor`, `Toast`, `Thumbnail`, `Portrait`, `BrandIcons` | Supporting pieces |

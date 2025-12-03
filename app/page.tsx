import MiniatureChaseScene from "@/app/components/MiniatureChaseScene";

export default function Home() {
  return (
    <main>
      <div className="canvas-wrap">
        <MiniatureChaseScene />
        <div className="canvas-overlay">
          <div className="status-bar">
            <span>Pixar-Style Miniature Reel</span>
            <span>08s Take</span>
            <span>Morning Sequence</span>
          </div>
          <div className="dialogue">
            <p className="dialogue-line">
              <strong>JAX</strong>
              Come on, Nino! If you&apos;re slow, we won’t make it!
            </p>
            <p className="dialogue-line">
              <strong>NINO</strong>
              Wait! This bag is too heavy!
            </p>
            <p className="footer-note">Tracking camera · Left flank · 35mm · f/1.8 · 60fps</p>
          </div>
        </div>
      </div>
    </main>
  );
}

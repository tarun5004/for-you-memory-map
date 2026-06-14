'use client';

type SceneDot = {
  id: string;
  label: string;
};

type ScrollProgressProps = {
  scenes: SceneDot[];
  activeIndex: number;
};

export default function ScrollProgress({ scenes, activeIndex }: ScrollProgressProps) {
  return (
    <nav className="scroll-progress" aria-label="Scene navigation">
      {scenes.map((scene, index) => (
        <button
          aria-label={`Go to ${scene.label}`}
          className={activeIndex === index ? 'active' : ''}
          key={scene.id}
          onClick={() => document.getElementById(scene.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          type="button"
        >
          <span>{scene.label}</span>
        </button>
      ))}
    </nav>
  );
}

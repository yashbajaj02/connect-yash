import { motion } from 'framer-motion';

const particles = Array.from({ length: 46 }, (_, index) => ({
  id: index,
  size: 2 + (index % 5),
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: (index % 9) * 0.28,
  duration: 8 + (index % 7),
}));

export function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(182,75,255,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(64,249,155,0.14),transparent_32%)]" />
      <div className="grid-mask absolute inset-0 opacity-60" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan-200/70 shadow-glow"
          style={{ width: particle.size, height: particle.size, left: particle.left, top: particle.top }}
          animate={{ y: [-20, 28, -20], opacity: [0.18, 0.9, 0.18], scale: [1, 1.8, 1] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

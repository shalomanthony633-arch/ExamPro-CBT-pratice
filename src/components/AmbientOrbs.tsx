export default function AmbientOrbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.09), transparent 70%)',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)',
          bottom: '15%',
          right: '-10%',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute w-[280px] h-[280px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%)',
          bottom: '5%',
          left: '-8%',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}

import { useRef } from 'react'

export default function TiltCard({ children, className = '', max = 10, glareClassName = 'rounded-2xl' }) {
  const ref = useRef(null)
  const glareRef = useRef(null)

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) scale(1.02)`
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(250,204,21,0.16), transparent 55%)`
      glareRef.current.style.opacity = '1'
    }
  }

  function handleLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
    >
      {children}
      <div
        ref={glareRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${glareClassName}`}
        style={{ opacity: 0, transition: 'opacity 0.25s ease', zIndex: 10 }}
      />
    </div>
  )
}

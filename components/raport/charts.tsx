'use client'

import { useId } from 'react'

type Seri = {
  name: string
  values: number[]
  color: string
}

function aman(value: unknown) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

export function RadarChart({
  labels,
  series,
  size = 340,
}: {
  labels: string[]
  series: Seri[]
  size?: number
}) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const center = size / 2
  const radius = size * 0.34
  const jumlah = Math.max(labels.length, 1)

  const titik = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / jumlah
    const r = (aman(value) / 100) * radius
    return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`
  }

  const polygon = (values: number[]) =>
    labels.map((_, index) => titik(index, values[index] ?? 0)).join(' ')

  return (
    <div>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto block w-full max-w-[360px] overflow-visible"
        role="img"
        aria-label="Grafik radar kemampuan atlet"
      >
        <defs>
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {series.map((s, i) => (
            <linearGradient key={s.name} id={`radar-${uid}-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.12" />
            </linearGradient>
          ))}
        </defs>

        {[20, 40, 60, 80, 100].map((level) => (
          <polygon
            key={level}
            points={labels.map((_, index) => titik(index, level)).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeOpacity={level === 100 ? 0.28 : 0.12}
            strokeWidth="1"
          />
        ))}

        {labels.map((label, index) => {
          const angle = -Math.PI / 2 + (index * Math.PI * 2) / jumlah
          const x = center + Math.cos(angle) * (radius + 20)
          const y = center + Math.sin(angle) * (radius + 20)
          const anchor = Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end'
          return (
            <g key={label}>
              <line
                x1={center}
                y1={center}
                x2={center + Math.cos(angle) * radius}
                y2={center + Math.sin(angle) * radius}
                stroke="currentColor"
                strokeOpacity="0.14"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor={anchor}
                className="fill-current text-[9px] font-semibold opacity-65"
              >
                {label}
              </text>
            </g>
          )
        })}

        {series.map((s, i) => (
          <g key={s.name} className="animate-radar-in">
            <polygon
              points={polygon(s.values)}
              fill={`url(#radar-${uid}-${i})`}
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              filter={i === series.length - 1 ? `url(#glow-${uid})` : undefined}
            />
            {labels.map((label, index) => {
              const [cx, cy] = titik(index, s.values[index] ?? 0).split(',')
              return <circle key={`${s.name}-${label}`} cx={cx} cy={cy} r="3.2" fill={s.color} />
            })}
          </g>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LineChart({
  labels,
  series,
  height = 230,
  max = 100,
}: {
  labels: string[]
  series: Seri[]
  height?: number
  max?: number
}) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const width = 760
  const padX = 42
  const padY = 24
  const plotWidth = width - padX * 2
  const plotHeight = height - padY * 2
  const jumlah = Math.max(labels.length, 1)
  const batas = Math.max(max, 1)

  const x = (index: number) => padX + (index * plotWidth) / Math.max(jumlah - 1, 1)
  const y = (value: number) => padY + plotHeight - (aman(value) / batas) * plotHeight

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full"
        style={{ height }}
        role="img"
        aria-label="Grafik perkembangan performa atlet"
        preserveAspectRatio="none"
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.name} id={`line-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.26" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {[0, 25, 50, 75, 100].map((level) => {
          const yy = padY + plotHeight - (level / 100) * plotHeight
          return (
            <g key={level}>
              <line x1={padX} y1={yy} x2={width - padX} y2={yy} stroke="#e2e8f0" strokeDasharray="4 6" />
              <text x={padX - 10} y={yy + 4} textAnchor="end" className="fill-slate-400 text-[10px]">
                {level}
              </text>
            </g>
          )
        })}

        {labels.map((label, index) => (
          <text
            key={`${label}-${index}`}
            x={x(index)}
            y={height - 5}
            textAnchor="middle"
            className="fill-slate-400 text-[10px]"
          >
            {label}
          </text>
        ))}

        {series.map((s, i) => {
          const points = s.values.map((v, index) => `${x(index)},${y(v)}`).join(' ')
          const area = `${padX},${padY + plotHeight} ${points} ${x(jumlah - 1)},${padY + plotHeight}`
          return (
            <g key={s.name}>
              <polygon points={area} fill={`url(#line-${uid}-${i})`} />
              <polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-path"
              />
              {s.values.map((v, index) => (
                <circle key={`${s.name}-${index}`} cx={x(index)} cy={y(v)} r="4" fill="#fff" stroke={s.color} strokeWidth="2.5">
                  <title>{`${s.name}: ${Math.round(v)} (${labels[index]})`}</title>
                </circle>
              ))}
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-5 rounded" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProgressRing({
  value,
  label,
  color = '#b91c1c',
  size = 104,
}: {
  value: number
  label: string
  color?: string
  size?: number
}) {
  const stroke = 8
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const v = aman(value)

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (v / 100) * circumference}
            className="transition-[stroke-dashoffset] duration-1000"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-xl font-extrabold text-slate-900">{Math.round(v)}</span>
        </div>
      </div>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  )
}

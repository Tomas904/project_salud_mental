import type { SVGProps } from 'react'

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><path d="M3 11l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>
)

export const SmileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
)

export const JournalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><path d="M5 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8 2v4"/><path d="M8 10h8"/><path d="M8 14h8"/></svg>
)

export const DumbbellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><path d="M3 10h2v4H3zM19 10h2v4h-2z"/><path d="M7 10h2v4H7zM15 10h2v4h-2z"/><path d="M9 12h6"/></svg>
)

export const TargetIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="M12 2v2"/><path d="M12 22v-2"/></svg>
)

export const BulbIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M2 11a10 10 0 1 1 20 0c0 3.5-2 5-3 6-1 1-1 2-1 2H6s0-1-1-2-3-2.5-3-6z"/></svg>
)

export const MedalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><circle cx="12" cy="8" r="4"/><path d="M8.5 12.5 6 22l6-3 6 3-2.5-9.5"/></svg>
)

export const ChartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/></svg>
)

export const BellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
)

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
)

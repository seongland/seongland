export interface TimelineEvent {
  year: number
  title: string
  description: string
}

export const timelineEvents: TimelineEvent[] = [
  { year: 2021, title: 'Seongland 1.0', description: 'Legacy web version launched' },
  { year: 2022, title: 'Seongland 2.0', description: 'Added 3D starfield features' },
  { year: 2024, title: 'Seongland 3.0', description: 'Cosmic timeline with train' },
]

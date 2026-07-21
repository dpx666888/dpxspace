export interface ProjectStory {
  why: string
  design: string
  development: string
  problems: { title: string; desc: string }[]
  solutions: string
  result: string
  summary: string
}

export interface TimelineEvent {
  date: string
  event: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  techStack: string[]
  githubUrl: string
  story: ProjectStory
  timeline: TimelineEvent[]
  aiCollaboration?: string
}

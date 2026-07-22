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
  id?: number
  project_id?: number
  date: string
  version?: string
  title?: string
  event?: string
  content?: string
  sort_order?: number
}

export interface ProjectTimelineItem {
  date: string
  event: string
}

export interface Project {
  id: number
  title: string
  slug: string
  description: string
  tags: string[]
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  cover_image: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  story: ProjectStory
  ai_collaboration: string | null
  timeline?: ProjectTimelineItem[]
  created_at: string
  updated_at: string
}

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at'>

export interface Log {
  id: number
  title: string
  date: string
  category: '学习' | '项目复盘' | '技术笔记'
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export type LogInput = Omit<Log, 'id' | 'created_at' | 'updated_at'>

export interface Lab {
  id: number
  title: string
  type: '工具' | 'Demo' | '实验'
  status: '进行中' | '已完成'
  description: string
  tech_stack: string[]
  demo_url: string | null
  github_url: string | null
  cover_image: string | null
  created_at: string
  updated_at: string
}

export type LabInput = Omit<Lab, 'id' | 'created_at' | 'updated_at'>

export interface Education {
  school: string
  major: string
  period: string
  courses: string
  achievements: string
  competitions: string
}

export interface Certificate {
  name: string
  icon: string
}

export interface Practice {
  icon: string
  title: string
  role: string
  desc: string
}

export interface SkillCategory {
  title: string
  icon: string
  skills: string[]
}

export interface GrowthRoute {
  period: string
  title: string
  desc: string
}

export interface AboutData {
  id: number
  intro: string[]
  education: Education
  certificates: Certificate[]
  practice: Practice[]
  tech_stack: SkillCategory[]
  growth_route: GrowthRoute[]
  ai_collaboration: {
    intro: string
    examples: string
  }
  updated_at: string
}

export type AboutInput = Partial<Omit<AboutData, 'id' | 'updated_at'>>

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface ContactData {
  id: number
  email: string
  github: string
  location: string
  bio: string
  socials: SocialLink[]
  created_at: string
  updated_at: string
}

export type ContactInput = Partial<Omit<ContactData, 'id' | 'created_at' | 'updated_at'>>

export interface Database {
  public: {
    Tables: {
      about: {
        Row: AboutData
        Insert: Omit<AboutData, 'id' | 'updated_at'>
        Update: Partial<Omit<AboutData, 'id' | 'updated_at'>>
      }
      projects: {
        Row: Project
        Insert: ProjectInput
        Update: Partial<ProjectInput>
      }
      project_timeline: {
        Row: TimelineEvent
        Insert: Omit<TimelineEvent, 'id'>
        Update: Partial<Omit<TimelineEvent, 'id'>>
      }
      labs: {
        Row: Lab
        Insert: LabInput
        Update: Partial<LabInput>
      }
      logs: {
        Row: Log
        Insert: LogInput
        Update: Partial<LogInput>
      }
      contacts: {
        Row: ContactData
        Insert: Omit<ContactData, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ContactData, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

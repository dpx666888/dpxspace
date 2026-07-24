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
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'sort_order'>

export interface Log {
  id: number
  title: string
  date: string
  category: '学习' | '项目复盘' | '技术笔记'
  content: string
  tags: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export type LogInput = Omit<Log, 'id' | 'created_at' | 'updated_at' | 'sort_order'>

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
  sort_order: number
  created_at: string
  updated_at: string
}

export type LabInput = Omit<Lab, 'id' | 'created_at' | 'updated_at' | 'sort_order'>

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
  section_order: string[]
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

export interface AiCollabData {
  id: number
  date: string
  title: string
  context: string
  prompt: string
  result: string
  project?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type AiCollabInput = Omit<AiCollabData, 'id' | 'created_at' | 'updated_at'>

export interface GalleryItem {
  id: number
  title: string
  description: string
  image_url: string
  category: string
  related_type: string
  related_id: number | null
  date: string
  sort_order: number
  created_at: string
}

export type GalleryInput = Omit<GalleryItem, 'id' | 'created_at'>

export interface SpaceModule {
  id: number
  title: string
  description: string
  icon: string
  route: string
  active: boolean
  sort_order: number
  created_at: string
}

export type SpaceModuleInput = Omit<SpaceModule, 'id' | 'created_at'>

export interface CoffeeLogData {
  id: number
  title: string
  date: string
  bean: string
  origin: string
  process_method: string
  equipment: string
  parameters: Record<string, string>
  description: string
  flavor_notes: string
  image_url: string
  rating: number
  sort_order: number
  created_at: string
}

export type CoffeeLogInput = Omit<CoffeeLogData, 'id' | 'created_at'>

export interface HomePageConfig {
  greeting: string
  name: string
  bio: string
  button_text: string
  skills: string[]
  skills_title: string
  projects_title: string
  logs_title: string
}

export interface SiteConfig {
  id: number
  key: string
  value: HomePageConfig
  updated_at: string
}

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
      site_config: {
        Row: SiteConfig
        Insert: Omit<SiteConfig, 'id' | 'updated_at'>
        Update: Partial<Omit<SiteConfig, 'id' | 'updated_at'>>
      }
      ai_collabs: {
        Row: AiCollabData
        Insert: Omit<AiCollabData, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AiCollabData, 'id' | 'created_at' | 'updated_at'>>
      }
      gallery: {
        Row: GalleryItem
        Insert: Omit<GalleryItem, 'id' | 'created_at'>
        Update: Partial<Omit<GalleryItem, 'id' | 'created_at'>>
      }
      space_modules: {
        Row: SpaceModule
        Insert: Omit<SpaceModule, 'id' | 'created_at'>
        Update: Partial<Omit<SpaceModule, 'id' | 'created_at'>>
      }
      coffee_logs: {
        Row: CoffeeLogData
        Insert: Omit<CoffeeLogData, 'id' | 'created_at'>
        Update: Partial<Omit<CoffeeLogData, 'id' | 'created_at'>>
      }
    }
  }
}

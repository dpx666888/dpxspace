export interface LabItem {
  id: string
  title: string
  description: string
  type: '工具' | 'Demo' | '实验'
  techStack: string[]
  link?: string
  githubUrl?: string
  status: '进行中' | '已完成'
}

export const labItems: LabItem[] = [
  {
    id: 'lab-1',
    title: '【待补充：实验室项目标题】',
    description: '【待补充：描述这个小工具/Demo/实验是做什么的】',
    type: '工具',
    techStack: ['【待补充】'],
    status: '进行中',
  },
  {
    id: 'lab-2',
    title: '【待补充】',
    description: '【待补充】',
    type: 'Demo',
    techStack: ['【待补充】'],
    status: '进行中',
  },
]

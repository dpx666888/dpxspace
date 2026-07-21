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
    id: 'aixprobe',
    title: 'AixProbe 嵌入式 AI 远程调试器复刻',
    description: '基于嘉立创开源方案，采用全志 T113-S3 主控芯片，独立完成元器件选型、PCB 手工焊接与硬件电路全流程调试。',
    type: '实验',
    techStack: ['全志 T113-S3', 'PCB 焊接', '硬件调试'],
    status: '已完成',
  },
  {
    id: 'crab-export',
    title: '螃蟹记账数据导出工具',
    description: '为螃蟹记账开发的数据导出模块，支持 Excel/CSV/JSON 多格式导出与导入，基于 xlsx 库实现。',
    type: '工具',
    techStack: ['uni-app', 'xlsx', 'Vue 3'],
    status: '已完成',
  },
]

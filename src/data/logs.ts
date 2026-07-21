export interface Log {
  id: string
  date: string
  title: string
  category: '学习' | '项目复盘' | '技术笔记'
  content: string
  tags: string[]
}

export const logs: Log[] = [
  {
    id: 'log-1',
    date: '2026-07-21',
    title: '【待补充：日志标题】',
    category: '学习',
    content: '【待补充：记录学习过程中的收获、困惑、心得体会】',
    tags: ['【待补充】'],
  },
  {
    id: 'log-2',
    date: '【待补充】',
    title: '【待补充】',
    category: '项目复盘',
    content: '【待补充：项目完成后的总结反思】',
    tags: ['【待补充】'],
  },
  {
    id: 'log-3',
    date: '【待补充】',
    title: '【待补充】',
    category: '技术笔记',
    content: '【待补充：技术知识点的整理和记录】',
    tags: ['【待补充】'],
  },
]

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
    date: '2026-07-17',
    title: '开始百日 C++ 学习计划',
    category: '学习',
    content: '创建 100-Days-of-C-Learning 仓库，计划系统学习 C++ 编程语言。',
    tags: ['C++', '学习计划'],
  },
  {
    id: 'log-2',
    date: '2026-07',
    title: '螃蟹记账 v1.0 发布',
    category: '项目复盘',
    content: '独立完成跨平台记账小程序的开发与打包发布，支持 Android/iOS/H5/微信小程序。实现了收支记录、分类统计、数据导出等核心功能。',
    tags: ['uni-app', 'Vue 3', '独立开发'],
  },
  {
    id: 'log-3',
    date: '2026-06',
    title: 'AixProbe 嵌入式硬件调试器复刻完成',
    category: '项目复盘',
    content: '基于嘉立创开源方案，使用全志 T113-S3 主控芯片完成 AixProbe 复刻。经历元器件选型、PCB 手工焊接、电源短路排查、串口通信调试等挑战，最终产出可稳定运行的硬件样机。',
    tags: ['嵌入式', '硬件', 'PCB'],
  },
  {
    id: 'log-4',
    date: '2026-05',
    title: '计算机设计大赛粤港澳大湾区决赛二等奖',
    category: '学习',
    content: '参赛作品聚焦物联网应用领域，负责项目核心模块开发与功能调试，作品通过赛区专家评审，荣获粤港澳大湾区赛区决赛二等奖。',
    tags: ['竞赛', '物联网', '获奖'],
  },
]

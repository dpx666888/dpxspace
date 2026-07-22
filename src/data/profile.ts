export const profile = {
  name: '丁鹏翔',
  title: '学生开发者',
  avatar: '/avatar.jpg',
  email: '2060786339@qq.com',
  github: 'https://github.com/dpx666888',
  location: '广东深圳',
  bio: [
    '一个学生开发者，利用 AI 和自己的代码，不断建造属于自己的数字世界。',
    '我热衷于动手落地各类想法，是偏爱实操的实践发烧友，想到创意就会尽全力亲手实现。日常离不开咖啡，习惯伴着咖啡钻研折腾各类项目。做事执行力强，崇尚亲身实操，不局限于空想，乐于在实践里摸索钻研。',
    '我也不知道我想成为一个怎么样的开发者，大概是不断把脑子里有趣的想法实现，不断钻研的吧。',
  ],
}

export const education = {
  school: '中山职业技术学院',
  major: '物联网应用技术',
  period: '2024.09 - 至今',
  courses: 'C语言、单片机、模电、数电',
  achievements: '专业排名前10%，获校级二等奖学金、优秀学生干部骨干',
  competitions: '计算机设计大赛粤港澳大湾区决赛二等奖、挑战杯校级三等奖',
}

export const skillCategoriesData = [
  { title: '编程语言', icon: 'Code2', skills: ['C++', 'JavaScript', 'TypeScript'] },
  { title: '前端框架', icon: 'Globe', skills: ['Vue', 'React', 'uni-app'] },
  { title: '工具与工程化', icon: 'Terminal', skills: ['Git', 'Vite'] },
  { title: '正在学习', icon: 'BookOpen', skills: ['Tailwind CSS', 'Framer Motion'] },
]

export const experiencesData = [
  {
    icon: 'Wrench',
    title: '螃蟹记账 — 跨平台记账小程序',
    role: '独立开发',
    desc: '独立完成个人日常收支管理需求分析、UI 设计与全栈开发。基于 uni-app + Vue 3 框架，实现 Android/iOS/H5/微信小程序多端适配。涵盖用户注册登录与多账号管理、收支记录管理（9类支出、4类收入）、首页仪表盘、分类统计图表、Excel/CSV/JSON 多格式数据导出与导入。',
  },
  {
    icon: 'Cpu',
    title: 'AixProbe 嵌入式 AI 远程调试器复刻',
    role: '独立开发者',
    desc: '基于嘉立创开源 AixProbe 方案，采用全志 T113-S3 主控芯片，独立完成元器件选型、PCB 手工焊接与硬件电路全流程调试；排查解决电源短路、串口通信异常、芯片引脚虚焊等典型硬件故障，最终产出可稳定运行的硬件样机。',
  },
  {
    icon: 'Award',
    title: '第十八届中国大学生计算机设计大赛',
    role: '核心开发',
    desc: '参赛作品聚焦物联网应用领域，负责项目核心模块开发与功能调试，作品通过赛区专家评审，荣获粤港澳大湾区赛区决赛二等奖。',
  },
]

export const certificatesData = [
  { name: '传感网应用开发职业技能等级证书（中级）', icon: 'Award' },
  { name: 'C1 驾驶证', icon: 'Award' },
  { name: '校级二等奖学金', icon: 'GraduationCap' },
  { name: '优秀学生干部骨干', icon: 'GraduationCap' },
]

export const timelineData = [
  { period: '2024.09', title: '入学 中山职业技术学院', desc: '物联网应用技术专业，开启专业学习之路。' },
  { period: '2024', title: '校级二等奖学金', desc: '学业成绩优异，专业排名前10%。' },
  { period: '2025', title: '计算机设计大赛粤港澳大湾区二等奖', desc: '参赛作品聚焦物联网应用领域，负责核心模块开发。' },
  { period: '2025', title: '挑战杯校级三等奖', desc: '团队协作完成创新项目。' },
  { period: '2026.05', title: '注册 GitHub 账号', desc: '开启代码托管与开源之旅。' },
  { period: '2026.05', title: 'AixProbe 嵌入式调试器复刻', desc: '基于全志 T113-S3 芯片的硬件项目实践。' },
  { period: '2026.05', title: '螃蟹记账小程序开发', desc: '独立开发跨平台记账应用。' },
  { period: '2026.07', title: '搭建个人电子名片网站', desc: '使用 React + Tailwind CSS 构建个人主页。' },
]

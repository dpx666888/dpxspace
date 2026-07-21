import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: '100-days-cpp',
    title: '100 Days of C++ Learning',
    description: '一个用来学习 C++ 的仓库，记录百日编程学习历程。',
    tags: ['学习', 'C++'],
    techStack: ['C++'],
    githubUrl: 'https://github.com/dpx666888/100-Days-of-C-Learning',
    story: {
      why: '【待补充：为什么开始学习C++？是课程要求、个人兴趣还是职业规划？】',
      design: '【待补充：学习路径是如何规划的？参考了哪些资料？】',
      development: '【待补充：学习过程中做了哪些练习、项目？】',
      problems: [
        { title: '【待补充：问题1】', desc: '【待补充：描述遇到的问题】' },
        { title: '【待补充：问题2】', desc: '【待补充：描述遇到的问题】' },
      ],
      solutions: '【待补充：如何克服学习中的困难？】',
      result: '【待补充：学习成果，掌握了哪些知识点？】',
      summary: '【待补充：这段学习经历带给你什么收获？】',
    },
    timeline: [
      { date: '2026-07-17', event: '创建仓库，开始百日学习计划' },
      { date: '【待补充】', event: '【待补充：重要里程碑】' },
    ],
    aiCollaboration: '【待补充：AI如何辅助你学习C++？】',
  },
  {
    id: 'git-learning',
    title: 'Git Learning',
    description: 'Git 版本控制学习笔记，从基础到进阶。',
    tags: ['学习', 'Git'],
    techStack: ['Git'],
    githubUrl: 'https://github.com/dpx666888/Git-Learning',
    story: {
      why: '【待补充：为什么学习Git？是为了团队协作还是个人代码管理？】',
      design: '【待补充：学习路径规划】',
      development: '【待补充：学习过程和实践】',
      problems: [
        { title: '【待补充：问题1】', desc: '【待补充】' },
      ],
      solutions: '【待补充】',
      result: '【待补充】',
      summary: '【待补充】',
    },
    timeline: [
      { date: '2026-07-17', event: '创建仓库，记录Git学习笔记' },
    ],
    aiCollaboration: '【待补充】',
  },
  {
    id: 'vue-app',
    title: 'App',
    description: '基于 Vue 的应用项目，持续迭代中。',
    tags: ['项目', 'Vue'],
    techStack: ['Vue'],
    githubUrl: 'https://github.com/dpx666888/-app',
    story: {
      why: '【待补充：这个应用解决什么问题？为什么要做这个项目？】',
      design: '【待补充：功能设计和界面设计思路】',
      development: '【待补充：开发过程，实现了哪些功能？】',
      problems: [
        { title: '【待补充：问题1】', desc: '【待补充】' },
        { title: '【待补充：问题2】', desc: '【待补充】' },
      ],
      solutions: '【待补充】',
      result: '【待补充：项目当前状态，已实现的功能】',
      summary: '【待补充】',
    },
    timeline: [
      { date: '2026-05-09', event: '创建项目，开始开发' },
      { date: '【待补充】', event: '【待补充】' },
    ],
    aiCollaboration: '【待补充：AI如何辅助这个项目开发？】',
  },
]

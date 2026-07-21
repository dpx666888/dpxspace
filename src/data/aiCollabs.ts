export interface AiCollab {
  id: string
  date: string
  title: string
  context: string
  prompt: string
  result: string
  project?: string
}

export const aiCollabs: AiCollab[] = [
  {
    id: 'ai-1',
    date: '2026-07-21',
    title: '【待补充：AI协作案例标题】',
    context: '【待补充：在什么场景下使用AI辅助？如学习C++时、搭建网站时】',
    prompt: '【待补充：你向AI提出的具体问题/Prompt是什么？】',
    result: '【待补充：AI给出了什么帮助？解决了什么问题？】',
    project: '个人电子名片网站',
  },
  {
    id: 'ai-2',
    date: '【待补充】',
    title: '【待补充】',
    context: '【待补充】',
    prompt: '【待补充】',
    result: '【待补充】',
  },
]

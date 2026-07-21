export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center px-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
            你好，我是开发者
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl">
            一名热爱技术、持续成长的学生开发者。这是我的个人电子名片，记录我的项目、实验和成长历程。
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">精选项目</h2>
          <p className="text-text-secondary">项目内容待补充...</p>
        </div>
      </section>
    </div>
  )
}

import { Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          丁鹏翔的个人电子名片
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dpx666888"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="mailto:a13265405786@outlook.com"
            className="text-text-secondary hover:text-accent transition-colors"
            aria-label="邮箱"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}

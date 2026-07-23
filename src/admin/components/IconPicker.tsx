import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Code2, Terminal, BookOpen, Globe, Award, GraduationCap, Cpu, Wrench,
  Github, Mail, MapPin, Zap, MessageSquare, Home, User, Folder,
  FlaskConical, LayoutDashboard, LogOut, Lock, AlertCircle, Loader2,
  Plus, Trash2, ArrowRight, ExternalLink, Send, Search, Star, Heart,
  Camera, Music, Video, Cloud, Database, Shield, Sun, Moon, Settings,
  FileText, Image, Link, Mic, Eye, ThumbsUp, Coffee, PenTool, Layers,
  BarChart3, TrendingUp, Rocket, Package, Puzzle,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2, Terminal, BookOpen, Globe, Award, GraduationCap, Cpu, Wrench,
  Github, Mail, MapPin, Zap, MessageSquare, Home, User, Folder,
  FlaskConical, LayoutDashboard, LogOut, Lock, AlertCircle, Loader2,
  Plus, Trash2, ArrowRight, ExternalLink, Send, Search, Star, Heart,
  Camera, Music, Video, Cloud, Database, Shield, Sun, Moon, Settings,
  FileText, Image, Link, Mic, Eye, ThumbsUp, Coffee, PenTool, Layers,
  BarChart3, TrendingUp, Rocket, Package, Puzzle,
}

const iconNames = Object.keys(iconMap)

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filtered = useMemo(() => {
    if (!search.trim()) return iconNames
    const lower = search.toLowerCase()
    return iconNames.filter(name => name.toLowerCase().includes(lower))
  }, [search])

  const SelectedIcon = iconMap[value]

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent flex items-center gap-2 hover:border-accent/50 transition-colors"
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon size={16} className="text-accent shrink-0" />
            <span>{value}</span>
          </>
        ) : (
          <span className="text-text-secondary/50">选择图标...</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-bg-secondary border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索图标..."
                className="w-full pl-8 pr-3 py-1.5 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent"
                autoFocus
              />
            </div>
          </div>
          <div className="p-2 grid grid-cols-7 gap-1 max-h-48 overflow-y-auto">
            {filtered.map(name => {
              const Icon = iconMap[name]
              const selected = name === value
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); setSearch('') }}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                    selected
                      ? 'bg-accent/20 text-accent ring-1 ring-accent/30'
                      : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                  }`}
                  title={name}
                >
                  <Icon size={18} />
                  <span className="text-[10px] leading-none truncate max-w-full">{name}</span>
                </button>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <p className="p-4 text-center text-sm text-text-secondary">未找到匹配的图标</p>
          )}
        </div>
      )}
    </div>
  )
}

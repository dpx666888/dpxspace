import {
  Coffee, Image, BookOpen, Cpu, Code2, Terminal, Globe, Award, GraduationCap,
  Wrench, Zap, MessageSquare, Home, User, Folder, FlaskConical, Mail, Star,
  Heart, Camera, Music, Video, Cloud, Database, Shield, Sun, Moon, Settings,
  FileText, Mic, Eye, ThumbsUp, PenTool, Layers, BarChart3, TrendingUp,
  Rocket, Package, Puzzle,
} from 'lucide-react'

export type IconComponent = React.ComponentType<{ size?: number; className?: string }>

export const iconMap: Record<string, IconComponent> = {
  Coffee, Image, BookOpen, Cpu, Code2, Terminal, Globe, Award, GraduationCap,
  Wrench, Zap, MessageSquare, Home, User, Folder, FlaskConical, Mail, Star,
  Heart, Camera, Music, Video, Cloud, Database, Shield, Sun, Moon, Settings,
  FileText, Mic, Eye, ThumbsUp, PenTool, Layers, BarChart3, TrendingUp,
  Rocket, Package, Puzzle,
}

export function getIcon(name: string | undefined | null): IconComponent {
  return (name && iconMap[name]) || Coffee
}

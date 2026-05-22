import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Cpu,
  File,
  FileText,
  FlaskConical,
  Globe2,
  GraduationCap,
  Handshake,
  Home,
  Image,
  Landmark,
  Laptop,
  Layers,
  Library,
  Mail,
  MapPin,
  Medal,
  Megaphone,
  Menu,
  Newspaper,
  Palette,
  Scale,
  Pencil,
  Phone,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Target,
  Trophy,
  Upload,
  User,
  UserRoundCheck,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** Semantic icon keys used across UNM (mapped to Lucide, stroke 1.75–2). */
export type IconName =
  | 'user'
  | 'graduation'
  | 'program'
  | 'library'
  | 'document'
  | 'check'
  | 'check-circle'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'upload'
  | 'mail'
  | 'phone'
  | 'globe'
  | 'calendar'
  | 'building'
  | 'laptop'
  | 'layers'
  | 'alert'
  | 'file'
  | 'edit'
  | 'send'
  | 'search'
  | 'arrow-right'
  | 'home'
  | 'star'
  | 'shield'
  | 'map-pin'
  | 'menu'
  | 'close'
  | 'award'
  | 'badge'
  | 'briefcase'
  | 'users'
  | 'book'
  | 'quote'
  | 'clock'
  | 'newspaper'
  | 'tag'
  | 'sparkles'
  | 'flask'
  | 'landmark'
  | 'target'
  | 'trophy'
  | 'cpu'
  | 'scale'
  | 'handshake'
  | 'medal'
  | 'user-check'
  | 'palette'
  | 'megaphone'
  | 'image';

const ICONS: Record<IconName, LucideIcon> = {
  user: User,
  graduation: GraduationCap,
  program: Library,
  library: Library,
  document: FileText,
  check: Check,
  'check-circle': CircleCheck,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  upload: Upload,
  mail: Mail,
  phone: Phone,
  globe: Globe2,
  calendar: CalendarDays,
  building: Building2,
  laptop: Laptop,
  layers: Layers,
  alert: AlertTriangle,
  file: File,
  edit: Pencil,
  send: Send,
  search: Search,
  'arrow-right': ArrowRight,
  home: Home,
  star: Star,
  shield: ShieldCheck,
  'map-pin': MapPin,
  menu: Menu,
  close: X,
  award: Award,
  badge: BadgeCheck,
  briefcase: Briefcase,
  users: Users,
  book: BookOpen,
  quote: Quote,
  clock: Clock,
  newspaper: Newspaper,
  tag: Tag,
  sparkles: Sparkles,
  flask: FlaskConical,
  landmark: Landmark,
  target: Target,
  trophy: Trophy,
  cpu: Cpu,
  handshake: Handshake,
  medal: Medal,
  scale: Scale,
  'user-check': UserRoundCheck,
  palette: Palette,
  megaphone: Megaphone,
  image: Image,
};

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  label?: string;
  weight?: 'normal' | 'medium';
}

export function Icon({ name, className, size = 20, label, weight = 'normal' }: IconProps) {
  const Lucide = ICONS[name];
  const strokeWidth = weight === 'medium' || size <= 16 ? 2 : 1.75;

  return (
    <Lucide
      size={size}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : 'presentation'}
    />
  );
}

export function IconBox({
  name,
  className,
  iconClassName,
  size = 'md',
  variant = 'default',
}: {
  name: IconName;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dark' | 'outline';
}) {
  const box = { sm: 'h-9 w-9 rounded-lg', md: 'h-11 w-11 rounded-lg', lg: 'h-14 w-14 rounded-xl' }[size];
  const icon = { sm: 18, md: 22, lg: 26 }[size];
  const variants = {
    default: 'icon-box text-primary',
    dark: 'glass-stat text-primary-200 !rounded-xl',
    outline: 'icon-box text-primary',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center transition-transform duration-300 ease-smooth',
        box,
        variants[variant],
        className,
      )}
    >
      <Icon name={name} size={icon} weight="medium" className={iconClassName} />
    </span>
  );
}

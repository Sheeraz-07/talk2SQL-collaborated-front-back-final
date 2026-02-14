"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, Moon, Sun, Menu, Sparkles, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useQueryStore } from '@/stores/queryStore';
import { LanguageToggle } from '@/components/query/LanguageToggle';
import {
  LayoutDashboard,
  MessageSquare,
  History,
  FileText,
  BarChart3,
  Database,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  title: string;
  onMobileMenuClick?: () => void;
}

const notifications = [
  {
    id: 1,
    title: 'Query completed',
    message: 'Your sales report is ready',
    time: '2 min ago',
    isRead: false,
    type: 'success'
  },
  {
    id: 2,
    title: 'New insight',
    message: 'Sales increased 23% this week',
    time: '1 hour ago',
    isRead: false,
    type: 'info'
  },
  {
    id: 3,
    title: 'Database connected',
    message: 'Production DB is now online',
    time: '3 hours ago',
    isRead: true,
    type: 'success'
  },
];

export function Header({ title, onMobileMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { language, setLanguage } = useQueryStore();

  const mainNavItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard', color: 'text-blue-500' },
    { icon: MessageSquare, label: t('query'), path: '/query', color: 'text-purple-500' },
    { icon: History, label: t('history'), path: '/history', color: 'text-orange-500' },
    { icon: FileText, label: t('reports'), path: '/reports', color: 'text-green-500' },
    { icon: BarChart3, label: t('analytics'), path: '/analytics', color: 'text-pink-500' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 items-center px-4 lg:px-6 max-w-full">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-2 mr-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMobileMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              Talk2SQL
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-accent/50",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : item.color)} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          {/* Search */}
          <DropdownMenu open={searchOpen} onOpenChange={setSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  className="pl-9"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Toggle */}
          <LanguageToggle current={language} onChange={setLanguage} className="mr-1" />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl">
              <DropdownMenuLabel className="flex items-center justify-between p-4">
                <span className="font-bold">{t('notifications')}</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="rounded-full">
                    {unreadCount} {t('new')}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto p-1">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer mb-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2 justify-center text-primary font-medium cursor-pointer">
                {t('viewAll')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 pl-2 pr-3 rounded-full ml-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs hidden sm:flex">
                  <span className="font-medium">{user?.name || 'User'}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
              <div className="p-2 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                {t('help')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

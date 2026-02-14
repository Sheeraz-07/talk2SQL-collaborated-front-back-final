import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  current: 'en' | 'ur';
  onChange: (lang: 'en' | 'ur') => void;
  className?: string;
}

export function LanguageToggle({ current, onChange, className }: LanguageToggleProps) {
  const toggle = () => onChange(current === 'en' ? 'ur' : 'en');

  return (
    <>
      {/* Mobile: Compact Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 sm:hidden rounded-full", className)}
        onClick={toggle}
      >
        <Globe className="h-4 w-4" />
        <span className="sr-only">{current === 'en' ? 'Switch to Urdu' : 'Switch to English'}</span>
        <span className="absolute -bottom-1 text-[8px] font-bold">{current.toUpperCase()}</span>
      </Button>

      {/* Desktop: Full Slider */}
      <div className={cn('hidden sm:grid relative grid-cols-2 p-1 gap-2 bg-secondary/50 rounded-lg border border-border/50 h-8 w-fit min-w-[200px]', className)}>
        <div
          className={cn(
            'absolute inset-y-1 rounded-md bg-primary shadow-sm transition-all duration-300 ease-in-out',
            current === 'en' ? 'left-1 w-[calc(50%-8px)]' : 'left-[calc(50%+4px)] w-[calc(50%-8px)]'
          )}
        />
        <button
          type="button"
          className={cn(
            'relative z-10 px-2 py-1 text-xs font-bold transition-colors duration-200 text-center rounded-md whitespace-nowrap flex items-center justify-center',
            current === 'en' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onChange('en')}
        >
          English
        </button>
        <button
          type="button"
          className={cn(
            'relative z-10 px-2 py-1 text-xs font-bold transition-colors duration-200 text-center rounded-md whitespace-nowrap flex items-center justify-center',
            current === 'ur' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onChange('ur')}
        >
          Roman Urdu
        </button>
      </div>
    </>
  );
}

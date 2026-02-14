import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  current: 'en' | 'ur';
  onChange: (lang: 'en' | 'ur') => void;
  className?: string;
}

export function LanguageToggle({ current, onChange, className }: LanguageToggleProps) {
  return (
    <div className={cn('relative grid grid-cols-2 p-1 gap-2 bg-secondary/50 rounded-lg border border-border/50 h-8 min-w-[200px]', className)}>
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
  );
}

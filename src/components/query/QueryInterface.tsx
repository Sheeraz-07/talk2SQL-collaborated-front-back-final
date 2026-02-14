import { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Send, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { VoiceButton } from './VoiceButton';
import { LanguageToggle } from './LanguageToggle';
import { SQLDisplay } from './SQLDisplay';
import { LoadingState } from './LoadingState';
import { DataTable } from './DataTable';
import { useQueryStore } from '@/stores/queryStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BarChart3, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';

// Garment manufacturing industry example queries
const exampleQueries = {
  en: [
    'Show today\'s attendance report',
    'Top selling products this month',
    'Low stock materials alert',
    'Production orders in progress',
    'Employees on leave this week',
    'Monthly sales by category',
  ],
  ur: [
    'Aaj ki attendance report dikhao',
    'Is mahine ki top selling products',
    'Kam stock materials ki list',
    'Production orders jo chal rahe hain',
    'Is hafte chutti pe employees',
    'Category wise monthly sales',
  ],
};



export function QueryInterface() {
  const {
    currentQuery,
    results,
    isLoading,
    loadingStep,
    language,
    setQuery,
    setLanguage,
    executeQuery,
    clearResults,
  } = useQueryStore();

  const { t } = useTranslation();

  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!currentQuery.trim() || isLoading) return;
      await executeQuery();
    },
    [currentQuery, isLoading, executeQuery]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      setQuery(text);
    },
    [setQuery]
  );

  const handleExampleClick = (query: string) => {
    setQuery(query);
  };

  const handleSaveQuery = () => {
    toast.success('Query saved to favorites');
  };

  // Example queries can remain here or move to translations. 
  // For now, let's keep them here but maybe use translations for the header "Try these examples"

  // ...

  return (
    <div className="space-y-6">
      {/* Query Input Card */}
      <Card
        className={cn(
          'p-3 transition-all duration-300',
          isFocused && 'ring-2 ring-primary shadow-lg shadow-primary/10'
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Main Input Area */}
          <div className="relative">
            <Textarea
              value={currentQuery}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t('askPlaceholder')}
              className="min-h-[40px] text-sm resize-none pr-12 focus-visible:ring-0 border-0 shadow-none bg-secondary/30 rounded-xl py-1.5"
              disabled={isLoading}
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <VoiceButton onTranscript={handleVoiceTranscript} language={language} className="h-7 w-7" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-end flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {results && (
                <Button type="button" variant="outline" size="sm" onClick={clearResults} className="h-8">
                  <RotateCcw className="h-3.5 w-3.5 mr-2" />
                  {t('clear')}
                </Button>
              )}
              <Button type="submit" disabled={isLoading || !currentQuery.trim()} className="h-8 px-4">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {t('processing')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t('askButton')}
                    <Send className="h-3.5 w-3.5" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Example Queries */}
        {!results && !isLoading && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              {t('tryExamples')}
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries[language].map((query) => (
                <Badge
                  key={query}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3"
                  onClick={() => handleExampleClick(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Loading State */}
      {isLoading && <LoadingState currentStep={loadingStep} />}

      {/* Results */}
      {results && !isLoading && (
        <div className="space-y-4 animate-fade-in">
          {/* Results Summary */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm py-1 px-3">
                📊 {results.rowCount} {t('rows')}
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                ⚡ {results.executionTime.toFixed(2)}s
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveQuery}>
                <Save className="h-4 w-4 mr-2" />
                {t('save')}
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t('visualize')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSubmit}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('rerun')}
              </Button>
            </div>
          </div>

          {/* SQL Display */}
          <SQLDisplay sql={results.generatedSQL} editable showExplanation />

          {/* Data Table */}
          <DataTable data={results.results} columns={results.columns} />
        </div>
      )}
    </div>
  );
}

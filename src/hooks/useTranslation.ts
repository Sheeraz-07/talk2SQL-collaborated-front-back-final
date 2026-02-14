import { useQueryStore } from '@/stores/queryStore';
import { translations, Language } from '@/lib/translations';

export const useTranslation = () => {
    // We use queryStore for language state since it's already there. 
    // Ideally this should be in a separate SettingsStore or Context.
    const language = useQueryStore((state) => state.language) as Language;

    const t = (key: keyof typeof translations['en']) => {
        return translations[language][key] || translations['en'][key] || key;
    };

    return { t, language };
};

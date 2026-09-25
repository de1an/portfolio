'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { LANG_STORAGE_KEY, STRINGS, type Lang, type Strings } from '@/lib/i18n';

type LanguageContextValue = {
	lang: Lang;
	setLang: (lang: Lang) => void;
	t: Strings;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [lang, setLangState] = useState<Lang>('en');

	useEffect(() => {
		try {
			const saved = localStorage.getItem(LANG_STORAGE_KEY);
			if (saved === 'en' || saved === 'sr') setLangState(saved);
		} catch {
			// localStorage unavailable — keep default
		}
	}, []);

	const setLang = useCallback((next: Lang) => {
		setLangState(next);
		try {
			localStorage.setItem(LANG_STORAGE_KEY, next);
		} catch {
			// localStorage unavailable — ignore
		}
	}, []);

	const value = useMemo<LanguageContextValue>(
		() => ({ lang, setLang, t: STRINGS[lang] }),
		[lang, setLang],
	);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const ctx = useContext(LanguageContext);
	if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
	return ctx;
}

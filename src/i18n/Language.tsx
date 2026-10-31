import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'it' | 'en';
const Context = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'it', setLanguage: () => {} });
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (param === 'en' || param === 'it') return param;
    try { return localStorage.getItem('registry-language') === 'en' ? 'en' : 'it'; } catch { return 'it'; }
  });
  useEffect(() => { document.documentElement.lang = language; try { localStorage.setItem('registry-language', language); } catch {} }, [language]);
  return <Context.Provider value={{ language, setLanguage }}>{children}</Context.Provider>;
}
export const useLanguage = () => useContext(Context);
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  return (
    <div role="group" aria-label="Lingua / Language" className="flex items-center justify-center gap-2">
      {([['it', '🇮🇹', 'Italiano'], ['en', '🇬🇧', 'English']] as const).map(([code, flag, label]) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-label={label}
          aria-pressed={language === code}
          title={label}
          className={`flex h-10 w-12 items-center justify-center rounded-xl border text-2xl transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#636842] ${language === code ? 'border-[#636842] bg-[#BCBF97]/25 shadow-sm' : 'border-transparent hover:bg-stone-100'}`}
        >
          <span aria-hidden="true">{flag}</span>
        </button>
      ))}
    </div>
  );
}
const known: Record<string, string> = {
  'Il nostro Matrimonio': 'Our Wedding',
  'La nostra lista nozze': 'Our Wedding Registry',
  'La vostra presenza è per noi il dono più prezioso. Se desiderate accompagnarci nel realizzare i nostri sogni per la nuova vita insieme o contribuire al nostro viaggio di nozze, qui potete inserire la vostra quota libera con versamento diretto su PayPal o bonifico bancario.': 'Your presence is the most precious gift of all. If you would like to help us make our dreams for our new life together come true or contribute to our honeymoon, you can make a contribution of your choice here.',
  "Cassa di champagne Brut 'Cuvée Sir Winston Churchill' Pol Roger 2018": "Case of Pol Roger 2018 Brut Champagne 'Cuvée Sir Winston Churchill'",
  'Rimowa – 2 trolley cabin': 'Rimowa – 2 cabin suitcases',
  'Divano Flexform a L': 'Flexform L-shaped sofa',
  'Sci – Rossignol ARCADE 94 OPEN DONNA/UOMO': 'Skis – Rossignol ARCADE 94 OPEN WOMEN/MEN',
  'Quadri di Classic Prints negozio in King’s Road a Londra': 'Artwork from Classic Prints on King’s Road, London',
};
export function translateContent(value: string, language: Language, english?: string) { return language === 'en' ? (english?.trim() || known[value] || value) : value; }

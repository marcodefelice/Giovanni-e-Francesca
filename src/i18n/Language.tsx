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
  return <label className="flex items-center gap-1 text-xs font-semibold text-stone-700"><span className="sr-only">Language / Lingua</span><select aria-label="Language / Lingua" value={language} onChange={e => setLanguage(e.target.value as Language)} className="rounded-lg border border-stone-300 bg-white px-2 py-2 text-stone-800"><option value="it">IT</option><option value="en">EN</option></select></label>;
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

const dictionaries = {
    en: () => import("@/dictionaries/en.json").then((m) => m.default),
    fa: () => import("@/dictionaries/fa.json").then((m) => m.default),
};

export const getDictionary = async (locale: string) => {
    const safeLocale = (locale === "fa" ? "fa" : "en") as "fa" | "en";
    return dictionaries[safeLocale]();
};


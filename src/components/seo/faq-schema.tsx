type FAQItem = {
    question_en?: string;
    question_fa?: string;
    answer_en?: string;
    answer_fa?: string;
};

type Props = {
    items: FAQItem[];
    locale: "en" | "fa";
};

export default function FAQSchema({ items, locale }: Props) {
    const isFa = locale === "fa";

    // ✅ فقط سوالاتی که سوال و جواب دارند را اضافه کن
    const validItems = items.filter((item) => {
        const question = isFa ? item.question_fa : item.question_en;
        const answer = isFa ? item.answer_fa : item.answer_en;
        return question && answer;
    });

    // ✅ اگر هیچ سوالی نبود، Schema خالی برگردان
    if (validItems.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": validItems.map((item) => ({
            "@type": "Question",
            "name": isFa ? item.question_fa : item.question_en,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": isFa ? item.answer_fa : item.answer_en,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
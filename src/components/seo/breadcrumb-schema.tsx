type BreadcrumbItem = {
    name: string;
    url: string;
};

type Props = {
    items: BreadcrumbItem[];
};

export default function BreadcrumbSchema({ items }: Props) {
    // ✅ حداقل ۲ آیتم نیاز است
    if (items.length < 2) return null;

    const baseUrl = "https://www.aureldesign.ir";

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `${baseUrl}${item.url}`,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
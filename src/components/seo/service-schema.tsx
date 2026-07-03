type ServiceItem = {
    name: string;
    description: string;
};

type Props = {
    services: ServiceItem[];
    locale: string;
};

export default function ServiceSchema({ services, locale }: Props) {
    if (services.length === 0) return null;

    const baseUrl = "https://www.aureldesign.ir";
    const isFa = locale === "fa";

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": services.map((service, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Service",
                "name": service.name,
                "description": service.description,
                "provider": {
                    "@type": "Organization",
                    "name": "Aurel Design Studio",
                    "url": baseUrl,
                },
                "areaServed": {
                    "@type": "Place",
                    "name": isFa ? "ایران و جهان" : "Iran & Worldwide",
                },
                "serviceType": "Jewelry Design Service",
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
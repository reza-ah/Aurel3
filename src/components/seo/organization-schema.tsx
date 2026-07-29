export default function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Aurel Design Studio",
        "alternateName": "ارل دیزاین",
        "url": "https://www.aureldesign.ir",
        "logo": "https://www.aureldesign.ir/icon.svg",
        "description": "Professional jewelry design studio offering CAD design, 3D modeling, resin printing and casting services",
        "foundingDate": "2010",
        "priceRange": "$$",
        "areaServed": "Worldwide",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Tehran",
            "addressCountry": "IR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 35.67639440068573,
            "longitude": 51.4127901957651
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+98-912-298-7123",
            "contactType": "customer service",
            "email": "info@aurelstudio.com",
            "availableLanguage": ["English", "Persian"]
        },
        "sameAs": [
            "https://www.instagram.com/aureldesignstudio",
            "https://www.linkedin.com/company/aurel-design-studio"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
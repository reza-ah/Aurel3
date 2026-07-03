export default function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Aurel Design Studio",
        "alternateName": "آرل دیزاین",
        "url": "https://www.aureldesign.ir",
        "logo": "https://www.aureldesign.ir/icon.svg",
        "description": "Professional jewelry design studio offering CAD design, 3D modeling, resin printing and casting services",
        "foundingDate": "2010",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Tehran",
            "addressCountry": "IR"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+98-912-298-7123",
            "contactType": "customer service",
            "email": "studio@aurelstudio.com",
            "availableLanguage": ["English", "Persian"]
        },
        "sameAs": [
            "https://www.instagram.com/aureldesignstudio",
            "https://linkedin.com/company/aureldesign"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
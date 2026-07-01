import LuxuryHero from "@/components/luxury-hero";
import AboutBrand from "@/components/about-brand";
import LuxuryCollections from "@/components/luxury-collections";

type Props = {
    section: any;
    locale: "en" | "fa";
    dict: any;
};

export default function HomepageSectionRenderer({
    section,
    locale,
    dict,
}: Props) {

    switch (section.type) {

        case "hero":
            return (
                <LuxuryHero
                    dict={dict}
                />
            );

        case "about":
            return (
                <AboutBrand
                    locale={locale}
                />
            );

        case "collections":
            return (
                <LuxuryCollections
                    locale={locale}
                />
            );

        // ✅ حذف شد - portfolio در page.tsx مستقیم رندر می‌شود
        case "portfolio":
            return null;

        default:
            return null;

    }

}
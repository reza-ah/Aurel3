import LuxuryHero from "@/components/luxury-hero";
import AboutBrand from "@/components/about-brand";
import LuxuryCollections from "@/components/luxury-collections";
import PortfolioSection from "@/features/portfolio/components/portfolio-section";



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

        case "portfolio":
            return (
                <PortfolioSection
                    locale={locale}
                />
            );

        default:
            return null;

    }

}


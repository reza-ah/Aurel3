import { client } from "@/lib/sanity";
import PricingAccordion from "./pricing-accordion";

async function getPricingData() {
    const categories = await client.fetch(
        `*[_type == "pricingCategory"] | order(sort asc) {
            _id,
            title_en,
            title_fa,
            slug,
            image,
            sort,
            description_en,
            description_fa
        }`
    );

    const items = await client.fetch(
        `*[_type == "pricingItem" && is_active == true] | order(sort asc) {
            _id,
            title_en,
            title_fa,
            description_en,
            description_fa,
            sort,
            is_active,
            price_en,
            price_fa,
            delivery_time_en,
            delivery_time_fa,
            img,
            suitable_en,
            suitable_fa,
            features_en,
            features_fa,
            category->{
                _id,
                title_en,
                title_fa
            }
        }`
    );

    return { categories, items };
}

export default async function PricingSection({ locale }: { locale: string }) {
    const { categories, items } = await getPricingData();

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-transparent">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <PricingAccordion
                    locale={locale}
                    categories={categories}
                    items={items}
                />
            </div>
        </section>
    );
}
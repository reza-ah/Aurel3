const DIRECTUS_URL =
    process.env.DIRECTUS_URL ||
    "http://127.0.0.1:8055";

const DIRECTUS_ASSETS_URL =
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    "http://127.0.0.1:8055";

const DIRECTUS_TOKEN =
    process.env.DIRECTUS_STATIC_TOKEN ||
    process.env.DIRECTUS_ADMIN_TOKEN ||
    null;

/* =========================
   INTERNAL REQUEST CACHE
========================= */

const pendingRequests = new Map<string, Promise<any>>();

/* =========================
   GENERIC FETCH
========================= */

async function directusFetch(endpoint: string, revalidate: number = 120, useToken: boolean = true) {
    const cacheKey = `${endpoint}|${revalidate}|${useToken}`;

    if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey);
    }

    const controller = new AbortController();

    const promise = (async () => {
        const timeout = setTimeout(() => controller.abort(), 10000);

        console.log(`[DEBUG] Fetching: ${DIRECTUS_URL}${endpoint}`);
        console.log(`[DEBUG] Token present: ${useToken && !!DIRECTUS_TOKEN}`);

        try {
            const res = await fetch(`${DIRECTUS_URL}${endpoint}`, {
                signal: controller.signal,
                next: { revalidate },
                headers: {
                    "Content-Type": "application/json",
                    ...(useToken && DIRECTUS_TOKEN
                        ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
                        : {}),
                },
            });

            if (!res.ok) {
                const errorText = await res.text();

                if (res.status === 403) {
                    console.error("🚨 Directus Permission Error (403):", endpoint);
                    console.error("Details:", errorText);
                    return [];
                }

                if (res.status === 404) {
                    console.error("🔍 Directus Endpoint Not Found (404):", endpoint);
                    return [];
                }

                console.error(`❌ Directus Error (${res.status}):`, endpoint);
                console.error("Details:", errorText);
                return [];
            }

            let json: any;

            try {
                json = await res.json();
            } catch {
                console.error("📄 Invalid JSON response from Directus:", endpoint);
                return [];
            }

            return json?.data ?? [];
        } catch (error: any) {
            if (error?.name === "AbortError") {
                console.error("⏰ Directus Request Timeout:", endpoint);
            } else {
                console.error("💥 Directus Fetch Error:", endpoint, error);
            }

            return [];
        } finally {
            clearTimeout(timeout);
            pendingRequests.delete(cacheKey);
        }
    })();

    pendingRequests.set(cacheKey, promise);

    return promise;
}

/* =========================
   ASSET HELPERS
========================= */

export function getAssetUrl(id?: string | null) {
    if (!id) return null;
    return `${DIRECTUS_ASSETS_URL}/assets/${id}`;
}

export function getOptimizedImage(
    id?: string | null,
    width: number = 1200,
    quality: number = 80,
    format: string = "webp"
) {
    if (!id) return null;
    return `${DIRECTUS_ASSETS_URL}/assets/${id}?width=${width}&quality=${quality}&format=${format}`;
}

/* =========================
   PRODUCTS
========================= */

export async function getProducts() {
    return directusFetch(
        `/items/products?fields=id,slug,title_en,title_fa,excerpt_en,excerpt_fa,image.id&filter[status][_eq]=published&sort=-date_created`,
        300
    );
}

export async function getProductBySlug(slug: string) {
    const data = await directusFetch(
        `/items/products?filter[slug][_eq]=${encodeURIComponent(
            slug
        )}&fields=id,slug,title_en,title_fa,excerpt_en,excerpt_fa,content_en,content_fa,image.id&limit=1`,
        300
    );

    return data?.[0] ?? null;
}

/* =========================
   PORTFOLIO
========================= */

const portfolioFields = [
    "id",
    "slug",
    "title_en",
    "title_fa",
    "category_en",
    "category_fa",
    "description_en",
    "description_fa",
    "cover_image",
    "gallery.directus_files_id",
    "tags.portfolio_tags_id.name_fa",
    "tags.portfolio_tags_id.name_en",
].join(",");

export async function getPortfolioItems() {
    return directusFetch(
        `/items/portfolio?fields=${portfolioFields}&filter[status][_eq]=published&sort=-date_created`,
        180
    );
}

export async function getFeaturedPortfolioItems() {
    return directusFetch(
        `/items/portfolio?fields=${portfolioFields}&filter[featured][_eq]=true&filter[status][_eq]=published&sort=-date_created`,
        180
    );
}

export async function getPortfolioBySlug(slug: string) {
    const data = await directusFetch(
        `/items/portfolio?filter[slug][_eq]=${encodeURIComponent(
            slug
        )}&fields=${portfolioFields}&limit=1`,
        180
    );

    return data?.[0] ?? null;
}

/* =========================
   JOURNAL
========================= */

const journalFields = [
    "id",
    "slug",
    "title_en",
    "title_fa",
    "excerpt_en",
    "excerpt_fa",
    "content_en",
    "content_fa",
    "cover_image",
    "date_created",
].join(",");

export async function getJournalPosts(limit?: number) {
    const limitQuery = limit ? `&limit=${limit}` : "";

    return directusFetch(
        `/items/journal?fields=${journalFields}&filter[status][_eq]=published&sort=-date_created${limitQuery}`,
        300
    );
}

export async function getJournalPost(slug: string) {
    const data = await directusFetch(
        `/items/journal?filter[slug][_eq]=${encodeURIComponent(
            slug
        )}&fields=${journalFields}&limit=1`,
        300
    );

    return data?.[0] ?? null;
}

export async function getRelatedJournalPosts(slug: string, limit = 3) {
    const posts = await getJournalPosts(10);
    return posts.filter((p: any) => p.slug !== slug).slice(0, limit);
}

/* =========================
   PRICING
========================= */

const pricingCategoryFields = [
    "id",
    "title_en",
    "title_fa",
    "image.id",
    "sort",
].join(",");

const pricingItemFields = [
    "id",
    "title_en",
    "title_fa",
    "description_en",
    "description_fa",
    "price_en",
    "price_fa",
    "delivery_time_en",
    "delivery_time_fa",
    "img.id",
    "sort",
    "category.id",
    "suitable_fa",
    "suitable_en",
    "features_fa",
    "features_en",
].join(",");

export async function getPricingCategories() {
    return directusFetch(
        `/items/pricing_categories?fields=${pricingCategoryFields}&sort=sort`,
        600,
        false
    );
}

export async function getPricingItems() {
    const data = await directusFetch(
        `/items/pricing_items_new?fields=${pricingItemFields}&filter[is_active][_eq]=true&sort=sort`,
        600,
        false
    );

    console.log("First item sample (Check image field):", data[0]);

    return data ?? [];
}

/* =========================
   HOMEPAGE SECTIONS
========================= */

export async function getHomepageSections(locale: string) {
    return directusFetch(
        `/items/homepage_sections?filter[enabled][_eq]=true&filter[locale][_eq]=${locale}&sort=sort`,
        60
    );
}
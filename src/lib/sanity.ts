import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

// Sanity client configuration
export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
});

// Image URL builder
const builder = createImageUrlBuilder(client);
export const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

export function urlFor(source: any) {
    return builder.image(source);
}

/* =========================
ASSET HELPERS
========================= */
export function getAssetUrl(image: any) {
    if (!image || !image.asset) return null;
    return urlFor(image).url();
}

export function getOptimizedImage(
    image: any,
    width: number = 1200,
    quality: number = 80,
    format: string = 'webp'
) {
    if (!image || !image.asset) return null;
    return urlFor(image)
        .width(width)
        .quality(quality)
        .auto('format')
        .url();
}

/* =========================
PRODUCTS
========================= */
export async function getProducts() {
    return client.fetch(
        `*[_type == "products" && status == "published"] | order(date_created desc) {
      _id,
      slug,
      title_en,
      title_fa,
      excerpt_en,
      excerpt_fa,
      image,
      date_created
    }`
    );
}

export async function getProductBySlug(slug: string) {
    const data = await client.fetch(
        `*[_type == "products" && slug.current == $slug][0] {
      _id,
      slug,
      title_en,
      title_fa,
      excerpt_en,
      excerpt_fa,
      content_en,
      content_fa,
      image,
      date_created
    }`,
        { slug }
    );
    return data ?? null;
}

/* =========================
PORTFOLIO
========================= */
export async function getPortfolioItems() {
    return client.fetch(
        `*[_type == "portfolio" && status == "published"] | order(date_created desc) {
      _id,
      slug,
      title_en,
      title_fa,
      category_en,
      category_fa,
      description_en,
      description_fa,
      cover_image,
      gallery,
      tags,
      featured,
      date_created
    }`
    );
}

export async function getFeaturedPortfolioItems() {
    return client.fetch(
        `*[_type == "portfolio" && featured == true && status == "published"] | order(date_created desc) {
      _id,
      slug,
      title_en,
      title_fa,
      category_en,
      category_fa,
      description_en,
      description_fa,
      cover_image,
      gallery,
      tags,
      featured,
      date_created
    }`
    );
}

export async function getPortfolioBySlug(slug: string) {
    const data = await client.fetch(
        `*[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      slug,
      title_en,
      title_fa,
      category_en,
      category_fa,
      description_en,
      description_fa,
      cover_image,
      gallery,
      tags,
      featured,
      date_created
    }`,
        { slug }
    );
    return data ?? null;
}

/* =========================
JOURNAL
========================= */
export async function getJournalPosts(limit?: number) {
    const limitQuery = limit ? `[0...${limit}]` : '';
    return client.fetch(
        `*[_type == "journal" && status == "published"] | order(date_created desc) ${limitQuery} {
      _id,
      slug,
      title_en,
      title_fa,
      excerpt_en,
      excerpt_fa,
      content_en,
      content_fa,
      cover_image,
      date_created
    }`
    );
}

export async function getJournalPost(slug: string) {
    const data = await client.fetch(
        `*[_type == "journal" && slug.current == $slug][0] {
      _id,
      slug,
      title_en,
      title_fa,
      excerpt_en,
      excerpt_fa,
      content_en,
      content_fa,
      cover_image,
      date_created
    }`,
        { slug }
    );
    return data ?? null;
}

export async function getRelatedJournalPosts(slug: string, limit = 3) {
    return client.fetch(
        `*[_type == "journal" && slug.current != $slug && status == "published"] | order(date_created desc) [0...${limit}] {
      _id,
      slug,
      title_en,
      title_fa,
      excerpt_en,
      excerpt_fa,
      cover_image,
      date_created
    }`,
        { slug }
    );
}

/* =========================
PRICING
========================= */
export async function getPricingCategories() {
    return client.fetch(
        `*[_type == "pricingCategory"] | order(sort asc) {
      _id,
      title_en,
      title_fa,
      image,
      sort
    }`
    );
}

export async function getPricingItems() {
    return client.fetch(
        `*[_type == "pricingItem" && is_active == true] | order(sort asc) {
      _id,
      title_en,
      title_fa,
      description_en,
      description_fa,
      price_en,
      price_fa,
      delivery_time_en,
      delivery_time_fa,
      img,
      sort,
      category->{
        _id,
        title_en,
        title_fa
      },
      suitable_en,
      suitable_fa,
      features_en,
      features_fa
    }`
    );
}

/* =========================
HOMEPAGE SECTIONS
========================= */
export async function getHomepageSections(locale: string) {
    return client.fetch(
        `*[_type == "homepageSection" && enabled == true && locale == $locale] | order(sort asc) {
      _id,
      type,
      enabled,
      locale,
      sort
    }`,
        { locale }
    );
}

/* =========================
FAQ
========================= */
export async function getFaqs() {
    return client.fetch(
        `*[_type == "faq"] | order(sort asc) {
      _id,
      question_en,
      question_fa,
      answer_en,
      answer_fa,
      sort
    }`
    );
}

/* =========================
ORDERS (Write Operations)
========================= */
export async function createOrder(orderData: {
    name: string;
    email: string;
    phone: string;
    message: string;
    files?: any[];
}) {
    return writeClient.create({
        _type: 'order',
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        message: orderData.message,
        files: orderData.files || [],
        status: 'new',
        date_created: new Date().toISOString(),
    });
}

/* =========================
CONTACT MESSAGES (Write Operations)
========================= */
export async function createContactMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    return writeClient.create({
        _type: 'contactMessage',
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
        date_created: new Date().toISOString(),
    });
}
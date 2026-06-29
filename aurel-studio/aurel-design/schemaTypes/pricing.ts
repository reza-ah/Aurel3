export const pricingCategory = {
    name: 'pricingCategory',
    title: 'دسته‌بندی قیمت',
    type: 'document',
    fields: [
        { name: 'title_en', title: 'Title (EN)', type: 'string' },
        { name: 'title_fa', title: 'Title (FA)', type: 'string' },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'sort', title: 'Sort Order', type: 'number' },
    ],
}

export const pricingItem = {
    name: 'pricingItem',
    title: 'آیتم قیمت',
    type: 'document',
    fields: [
        { name: 'title_en', title: 'Title (EN)', type: 'string' },
        { name: 'title_fa', title: 'Title (FA)', type: 'string' },
        { name: 'description_en', title: 'Description (EN)', type: 'text' },
        { name: 'description_fa', title: 'Description (FA)', type: 'text' },
        { name: 'price_en', title: 'Price (EN)', type: 'string' },
        { name: 'price_fa', title: 'Price (FA)', type: 'string' },
        { name: 'delivery_time_en', title: 'Delivery Time (EN)', type: 'string' },
        { name: 'delivery_time_fa', title: 'Delivery Time (FA)', type: 'string' },
        { name: 'img', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'sort', title: 'Sort Order', type: 'number' },
        { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'pricingCategory' }] },
        { name: 'suitable_en', title: 'Suitable (EN)', type: 'text' },
        { name: 'suitable_fa', title: 'Suitable (FA)', type: 'text' },
        { name: 'features_en', title: 'Features (EN)', type: 'text' },
        { name: 'features_fa', title: 'Features (FA)', type: 'text' },
        { name: 'is_active', title: 'Active', type: 'boolean', initialValue: true },
    ],
}
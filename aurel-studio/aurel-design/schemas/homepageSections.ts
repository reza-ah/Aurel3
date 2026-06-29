export default {
    name: 'homepageSection',
    title: 'بخش صفحه اصلی',
    type: 'document',
    fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'locale', title: 'Locale', type: 'string', options: { list: ['en', 'fa'] } },
        { name: 'content', title: 'Content', type: 'text' },
        { name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true },
        { name: 'sort', title: 'Sort Order', type: 'number' },
    ],
}
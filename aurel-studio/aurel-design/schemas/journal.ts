export default {
    name: 'journal',
    title: 'مقالات',
    type: 'document',
    fields: [
        { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title_en' } },
        { name: 'title_en', title: 'Title (EN)', type: 'string' },
        { name: 'title_fa', title: 'Title (FA)', type: 'string' },
        { name: 'excerpt_en', title: 'Excerpt (EN)', type: 'text' },
        { name: 'excerpt_fa', title: 'Excerpt (FA)', type: 'text' },
        { name: 'content_en', title: 'Content (EN)', type: 'text' },
        { name: 'content_fa', title: 'Content (FA)', type: 'text' },
        { name: 'cover_image', title: 'Cover Image', type: 'image', options: { hotspot: true } },
        { name: 'status', title: 'Status', type: 'string', options: { list: ['published', 'draft'] }, initialValue: 'draft' },
        { name: 'date_created', title: 'Date Created', type: 'datetime', initialValue: () => new Date().toISOString() },
    ],
}
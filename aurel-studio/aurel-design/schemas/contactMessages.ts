export default {
    name: 'contactMessage',
    title: 'پیام‌های تماس',
    type: 'document',
    fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'subject', title: 'Subject', type: 'string' },
        { name: 'message', title: 'Message', type: 'text' },
        { name: 'date_created', title: 'Date Created', type: 'datetime', initialValue: () => new Date().toISOString() },
    ],
}
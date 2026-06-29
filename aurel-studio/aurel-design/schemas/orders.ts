export default {
    name: 'order',
    title: 'سفارشات',
    type: 'document',
    fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'phone', title: 'Phone', type: 'string' },
        { name: 'message', title: 'Message', type: 'text' },
        { name: 'files', title: 'Files', type: 'array', of: [{ type: 'file' }] },
        { name: 'status', title: 'Status', type: 'string', options: { list: ['new', 'in_progress', 'completed'] }, initialValue: 'new' },
        { name: 'date_created', title: 'Date Created', type: 'datetime', initialValue: () => new Date().toISOString() },
    ],
}
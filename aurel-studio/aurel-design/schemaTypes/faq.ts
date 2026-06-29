export default {
    name: 'faq',
    title: 'سوالات متداول',
    type: 'document',
    fields: [
        { name: 'question_en', title: 'Question (EN)', type: 'string' },
        { name: 'question_fa', title: 'Question (FA)', type: 'string' },
        { name: 'answer_en', title: 'Answer (EN)', type: 'text' },
        { name: 'answer_fa', title: 'Answer (FA)', type: 'text' },
        { name: 'sort', title: 'Sort Order', type: 'number' },
    ],
}
export default {
  name: 'comment',
  type: 'document',
  title: 'Comment',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'approved',
      type: 'boolean',
      title: 'Approved',
      description: 'Comments wont show on the site without approval',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
      name: 'comment',
      type: 'text',
      title: 'Comment',
    },
    {
      name: 'posts',
      type: 'reference',
      title: 'posts',
      to: [{ type: 'posts' }],
    },
  ],
};

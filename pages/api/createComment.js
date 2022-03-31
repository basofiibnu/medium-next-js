import sanityClient from '@sanity/client';

const config = {
  token: process.env.NEXT_PUBLIC_SANITY_PROJECT_TOKEN,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
};

const client = sanityClient(config);

export default async function handler(req, res) {
  const { _id, name, email, comment } = JSON.parse(req.body);

  try {
    const create = await client.create({
      _type: 'comment',
      posts: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: 'error', data: error });
  }
  return res.status(200).json({ message: 'success' });
}

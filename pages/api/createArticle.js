import sanityClient from '@sanity/client'

const config = {
  token: process.env.NEXT_PUBLIC_SANITY_PROJECT_TOKEN,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
}

const client = sanityClient(config)

export default async function handler(req, res) {
  const { title, description, _category, _author, content } = JSON.parse(
    req.body
  )

  try {
    const create = await client.create({
      _type: 'posts',
      title,
      slug: {
        _type: 'slug',
        current: title.toLowerCase().replace(/\s/g, '-'),
      },
      description,
      categories: [
        {
          _key: Math.random().toString(16).slice(2, 10),
          _type: 'reference',
          _ref: _category,
        },
      ],
      author: {
        _type: 'reference',
        _ref: _author,
      },
      body: [
        {
          _key: Math.random().toString(16).slice(2, 12),
          _type: 'block',
          children: [
            {
              _key: Math.random().toString(16).slice(1, 13),
              _type: 'span',
              marks: [],
              text: content,
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      publishedAt: new Date().toISOString(),
    })

    return res.status(200).json({ message: 'success', data: create._id })
  } catch (error) {
    return res.status(500).json({ message: 'error', data: error })
  }
}

import sanityClient from '@sanity/client';
import path from 'path';
import fs from 'fs';

const config = {
  token: process.env.NEXT_PUBLIC_SANITY_PROJECT_TOKEN,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
};

const client = sanityClient(config);

export default async function handler(req, res) {
  const { filename, id } = JSON.parse(req.body);
  const dirRelativeToPublicFolder = 'uploads';

  const dir = path.resolve('./public', dirRelativeToPublicFolder);

  const filenames = fs.readdirSync(dir);

  const images = filenames
    .filter((name) => name === filename)
    .map((name) =>
      path.join('public/', dirRelativeToPublicFolder, name),
    );

  try {
    await client.assets
      .upload('image', fs.createReadStream(images[0]), {
        filename: path.basename(images[0]),
      })
      .then(async (imageAsset) => {
        await client
          .patch(id)
          .set({
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id,
              },
            },
          })
          .commit();
      });

    return res.status(200).json({
      message: 'success',
      data: { images, id },
    });
  } catch (error) {
    return res.status(500).json({ message: 'success', data: error });
  }
}

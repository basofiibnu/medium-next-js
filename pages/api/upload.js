import { IncomingForm } from 'formidable';

var mv = require('mv');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        const oldPath = files.file.filepath;
        const newPath = `./public/uploads/${files.file.originalFilename}`;
        mv(oldPath, newPath, { mkdirp: true }, function (err) {});
        const { file } = files;
        return res
          .status(200)
          .json({ message: 'success', data: { fields, file } });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

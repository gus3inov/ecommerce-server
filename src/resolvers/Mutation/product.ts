import * as shortid from "shortid";
import { createWriteStream, createReadStream } from 'fs';
import { getUserId, Context } from '../../utils';

const storeUpload = async ({ stream, filename }): Promise<any> => {
  const path = `images/${shortid.generate()}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ path }))
      .on("error", reject)
  );
};


const processUpload = async upload => {
  const image = await upload;
  const { createReadStream, filename } = await upload;
  console.log('image', image);
  console.log('createReadStream', createReadStream);
  const stream = createReadStream();
  const { path } = await storeUpload({ stream, filename });
  return path;
  // return upload.then(async file => {
  //   const { stream, filename } = file;
  //   const { path } = await storeUpload({ stream, filename });

  //   return path;
  // });
};

export const product = {
  async createProduct(parent, { name, price, picture }, ctx: Context, info) {
    const userId = getUserId(ctx);
    const pictureUrl = await processUpload(picture);

    return ctx.db.mutation.createProduct(
      {
        data: {
          name,
          price,
          pictureUrl,
          seller: {
            connect: { id: userId }
          }
        }
      },
      info
    );
  }
};

import * as shortid from "shortid";
import { createWriteStream, createReadStream } from 'fs';
import { forwardTo } from 'prisma-binding';
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
  const stream = createReadStream();
  const { path } = await storeUpload({ stream, filename });
  return path;
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
  },
  async updateProduct(
    parent,
    { id, name, price, picture },
    ctx: Context,
    info
  ) {
    const userId = getUserId(ctx);
    console.log(name);
    // const product = await ctx.db.query.product({ where: { id } });
    // console.log('product: ', product);
    // if (userId !== product.seller.id) {
    //   throw new Error("Not authorized");
    // }

    let pictureUrl = null;
    if (picture) {
      pictureUrl = await processUpload(picture);
    }

    return ctx.db.mutation.updateProduct(
      {
        data: {
          name,
          price,
          pictureUrl
        },
        where: {
          id
        }
      },
      info
    );
  },
  deleteProduct: forwardTo('db'),
};

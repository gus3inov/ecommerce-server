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

interface ProductData {
  name?: string;
  price?: number;
  pictureUrl?: string;
}

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
    const product = await ctx.db.query.product(
      { where: { id } },
      `{
          seller {
            id
          }
      }`
    );

    if (userId !== product.seller.id) {
      throw new Error("Not authorized");
    }

    const data: ProductData = {};

    if(name) {
      data.name = name;
    }

    if(price) {
      data.price = price;
    }

    if (picture) {
      data.pictureUrl = await processUpload(picture);
    }


    return ctx.db.mutation.updateProduct(
      {
        data,
        where: {
          id
        }
      },
      info
    );
  },
  deleteProduct: forwardTo('db'),
};

import { SchemaOptions } from '@nestjs/mongoose';

/**
 * Apply timestamp fields to the schema.
 *
 */
export const DefaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(doc, ret, options) {
      delete ret.__v;
      delete ret.deletedAt;
      delete ret.isDeleted;
      return ret;
    },
  },
};

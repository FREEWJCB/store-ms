import { ApiPropertyOptions } from '@nestjs/swagger';

export const productsSwagger = {
  name: <ApiPropertyOptions>{
    type: 'string',
    description: 'Name of the product.',
    example: 'Hardcover Notebook',
  },
  price: <ApiPropertyOptions>{
    type: 'number',
    format: 'float',
    description: 'Price of the product with up to 2 decimal places.',
    example: 12.99,
  },
  stock: <ApiPropertyOptions>{
    type: 'integer',
    description: 'Number of items available in stock.',
    example: 150,
  },
  imageURL: <ApiPropertyOptions>{
    type: 'string',
    description: 'URL of the product image.',
    example: 'https://example.com/images/notebook.jpg',
  },
};

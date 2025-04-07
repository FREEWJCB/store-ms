import { Injectable } from '@nestjs/common';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';

@Injectable()
export class CartService {
  constructor(private cartRepository: CartRepository) {}

  public async create(body: Partial<Cart>): Promise<Cart> {
    return this.cartRepository.create(body);
  }
}

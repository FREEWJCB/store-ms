import { Injectable } from '@nestjs/common';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';

@Injectable()
export class CartService {
  constructor(private cartRepository: CartRepository) {}

  public async lists(): Promise<Cart[]> {
    return this.cartRepository.lists();
  }

  public async create(body: Partial<Cart>): Promise<Cart> {
    return this.cartRepository.create(body);
  }

  public async update(
    id: string,
    body: Partial<Cart>,
  ): Promise<[affectedCount: number, affectedRows: Cart[]]> {
    return this.cartRepository.update({ id }, body);
  }

  public async delete(id: string, force: boolean = false): Promise<number> {
    return this.cartRepository.delete({ where: { id }, force });
  }

  public async clean(force: boolean = false): Promise<number> {
    return this.cartRepository.delete({ truncate: true, force });
  }
}

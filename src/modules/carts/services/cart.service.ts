import { Injectable } from '@nestjs/common';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';

@Injectable()
export class CartService {
  // Inyecta el repositorio de carrito para acceder a la base de datos
  constructor(private cartRepository: CartRepository) {}

  // Retorna todos los carritos existentes
  public async lists(): Promise<Cart[]> {
    return this.cartRepository.lists();
  }

  // Crea un nuevo carrito con los datos proporcionados
  public async create(body: Partial<Cart>): Promise<Cart> {
    return this.cartRepository.create(body);
  }

  // Actualiza un carrito existente según su ID con los nuevos datos
  // Retorna una tupla con el número de registros afectados y los registros modificados
  public async update(
    id: string,
    body: Partial<Cart>,
  ): Promise<[affectedCount: number, affectedRows: Cart[]]> {
    return this.cartRepository.update({ id }, body);
  }

  // Elimina un carrito según su ID
  // Si `force` es true, lo elimina físicamente; si es false, hace un borrado lógico
  public async delete(id: string, force: boolean = false): Promise<number> {
    return this.cartRepository.delete({ where: { id }, force });
  }

  // Elimina todos los carritos
  // Si `force` es true, hace un truncate (eliminación total); si es false, los marca como eliminados (soft delete)
  public async clean(force: boolean = false): Promise<number> {
    return this.cartRepository.delete({ truncate: true, force });
  }
}

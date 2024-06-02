import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from './entities/Product.entity';
import { GetByCategoryDTO } from './dtos/getCategory.dto';
import { GetRelatedProductDTO } from './dtos/getRelatedProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  getEmoji(): string {
    return '🦊';
  }

  //Get Product
  getProduct(id: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      relations: ['productCharacteristics'],
      where: { id: id },
    });
  }

  //Get Products page paginated
  async get(query: GetByCategoryDTO) {
    const pageSize: number = 40;
    const pageNumber: number = +query.page || 1;
    const skip = (pageNumber - 1) * pageSize;
    const categoryName = query.category;
    switch (query.sortBy) {
      case 'LowHigh':
      case 'HighLow':
        const order = query.sortBy == 'LowHigh' ? 'ASC' : 'DESC';
        const data = await this.productsRepository
          .createQueryBuilder('products')
          .leftJoinAndSelect('products.categories', 'category')
          .leftJoinAndSelect(
            'products.productCharacteristics',
            'productCharacteristic',
          )
          .leftJoinAndSelect(
            'productCharacteristic.characteristic',
            'characteristic',
          )
          .where("characteristic.name = 'price'")
          .andWhere("productCharacteristic.value != ''")
          .andWhere('category.name = :categoryName', { categoryName })
          .orderBy('productCharacteristic.value', order)
          .skip(skip)
          .take(pageSize)
          .getMany();
        return data;
    }
  }
  async getRelatedProduct(query: GetRelatedProductDTO) {
    return this.productsRepository.find({
      relations: ['productCharacteristics'],
      where: { id: Not(query.id),
        name: query.name
       },
    });
  }
}

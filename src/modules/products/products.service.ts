import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from './entities/Product.entity';
import { GetByCategoryDTO } from './dtos/getCategory.dto';
import { GetByQueryDto } from './dtos/getByQuerry.dto';
import { GetRelatedProductDTO } from './dtos/getRelatedProduct.dto';
import { FlattenProduct } from '../utils/types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  getEmoji(): string {
    return '🦊';
  }

  //Get Product
  async getProduct(id: string) {
    return this.productsRepository.findOne({
      relations: ['productCharacteristics'],
      where: { id: id },
    });
  }

  async getProductFlattened(id: string) {
     let data = this.flattenProduct(await this.getProduct(id));
    return data
  }


  private flattenProduct(product: Product): FlattenProduct {
    const flatProduct: FlattenProduct = {
      id: product.id,
      name: product.name,
      imgUrl: product.imgUrl,
      categories: product.categories,
      characteristics: [],
      price: product.price,
    };
    for (const productCharacteristic of product.productCharacteristics) {
      flatProduct.characteristics.push({
        characteristicId: productCharacteristic.characteristic.id,
        characteristicName: productCharacteristic.characteristic.name,
        valueId: productCharacteristic.id,
        value: productCharacteristic.value,
      });
    }
    return flatProduct;
  }

  async get(query: GetByQueryDto) {
    const pageSize: number = 20;
    const pageNumber: number = +query.page || 1;
    const skip = (pageNumber - 1) * pageSize;
    const { category, filters, keyword } = query;

    // Start building the query
    let qb = this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.categories', 'category')
      .leftJoinAndSelect('products.productCharacteristics', 'productCharacteristic')
      .leftJoinAndSelect('productCharacteristic.characteristic', 'characteristic');

    // Check if category is defined and add condition
    if (category) {
      qb = qb.andWhere('category.name = :category', { category });
    }

    // Use filters if defined
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value], index) => {
        const paramName = `value${index}`;
        qb = qb.andWhere(`characteristic.name = :name${index} AND productCharacteristic.value IN (:...${paramName})`, {
          [`name${index}`]: key,
          [paramName]: value,
        });
      });
    }

    // Check if keyword is defined and add condition for product search by name
    if (keyword) {
      qb = qb.andWhere('products.name ILIKE :keyword', { keyword: `%${keyword}%` });
    }

    const order = query.sortBy === 'LowHigh' ? 'DESC' : 'ASC' || 'DESC';

    // Apply sorting and pagination
    qb = qb.orderBy('products.price', order)
      .skip(skip)
      .take(pageSize);

    // Execute the query
    const data = await qb.getManyAndCount()

    //flatten the data
    let flatData = []
    data[0].forEach((product) => {
      flatData.push(this.flattenProduct(product));
    })

    let result = {
      products: flatData,
      totalPages: Math.ceil(data[1] / pageSize),
      currentPage: pageNumber,
      pageSize: pageSize,
    }

    return result;
  }


  async getRelatedProduct(query: GetRelatedProductDTO) {
    return this.productsRepository.find({
      relations: ['productCharacteristics'],
      where: {
        id: Not(query.id),
        name: query.name
      },
    });
  }
}

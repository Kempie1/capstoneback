import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sortByEnum } from '../utils/enums'
import { Product } from './entities/Product.entity';
import { Characteristic } from './entities/Characteristic.entity';
import { ProductCharacteristic } from './entities/ProductCharacteristic.entity';
import { GetByCategoryDTO } from './dtos/getCategory.dto';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
      ) {}

    getHello(): string {
        return 'Hello World!';
      }

    //Get Product
    getProduct(id:string): Promise<Product | null>{
        return this.productsRepository.findOne({ 
            relations: ['productCharacteristics'],
            where:{id:id} 
        });
    }

    //Get Products page paginated
    async get(query:GetByCategoryDTO) {
        const pageSize: number = 50;
        const pageNumber: number = +query.page || 1;
        const skip = (pageNumber - 1) * pageSize;
        console.log("I am trying 1")
        console.log("Getting🦊",query.sortBy)
        switch (query.sortBy){
            case sortByEnum.LowHigh:
                console.log("I am trying 2")
            case sortByEnum.HighLow:
                console.log("I am trying 3")
                const order = ((query.sortBy == 0) ? 'ASC' : 'DESC');
                const data = await this.productsRepository
                .createQueryBuilder("products")
                .leftJoinAndSelect("products.productCharacteristics", "productCharacteristic")
                .leftJoinAndSelect("productCharacteristic.characteristic", "characteristic")
                .where("characteristic.name = 'price'")
                .andWhere("productCharacteristic.value != ''")
                .orderBy("productCharacteristic.value", order)
                .skip(skip)
                .take(pageSize)
                .getMany();

                return data
                default:
                    console.log("I am trying 111")   
        }

        // return paginateResponse(data, pageNumber, pageSize);
      }

}
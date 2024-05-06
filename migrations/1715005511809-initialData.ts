import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "src/modules/products/entities/Product.entity";
import * as fs from "fs";
import * as path from "path";
import { Characteristic } from "src/modules/products/entities/Characteristic.entity";
import { ProductCharacteristic } from "src/modules/products/entities/ProductCharacteristic.entity";

export class InitialData1715005511809 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tempURL = "https://cdn.discordapp.com/attachments/600970036386988046/1237050444283641886/RDT_20240117_1412282784247811892924977.jpg?ex=663a3c81&is=6638eb01&hm=ade8318a8e7ec6f61ad2f29bf5826a2398336d748197563f8b10f5fa9408289d&"
        
        var csvFolderPath = path.resolve(__dirname, 'sourceData')
        console.log(__dirname)
        console.log(csvFolderPath)
        
        // await queryRunner.manager.insert<Product>(Product, [
        //     {
        //         name: ,
        //         imgUrl: tempURL,
        //     }
        // ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

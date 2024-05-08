import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "../src/modules/products/entities/Product.entity";
import * as fs from "fs";
import * as path from "path";
import { parse } from 'fast-csv';
import { Characteristic } from "../src/modules/products/entities/Characteristic.entity";
import { ProductCharacteristic } from "../src/modules/products/entities/ProductCharacteristic.entity";
import motherboardsJson from '../sourceData/json/motherboard.json'
import { query } from "express";

export class InitialData1715005511809 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.startTransaction();
        const tempURL = "https://cdn.discordapp.com/attachments/600970036386988046/1237050444283641886/RDT_20240117_1412282784247811892924977.jpg?ex=663a3c81&is=6638eb01&hm=ade8318a8e7ec6f61ad2f29bf5826a2398336d748197563f8b10f5fa9408289d&"
        
        // Function to check if a file is a CSV file
        const isCSVFile = (fileName: string): boolean => {
            return fileName.split('.').pop()?.toLowerCase() === 'csv';
        };
        
        // Function to read a CSV file
        const readCSVFile = async (filePath: string): Promise<string[][]> => {
            try {
            const stream = fs.createReadStream(filePath);
            const csvData: string[][] = [];

            const csvStream = parse({ headers: true })
                .on('data', (row) => csvData.push(row))
                .on('end', () => console.log(`Finished reading CSV`))
                .on('error', (error) => console.error(`Error parsing CSV:`, error));

            await new Promise((resolve, reject) => {
                stream.pipe(csvStream);
                stream.on('end', resolve);
                stream.on('error', reject);
            });

            return csvData;
            } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            return [];
            }
            };
        
        // Main function
        const readCSVDirectory = async (folderPath: string): Promise<any> => {
            try {
            const files = await fs.promises.readdir(folderPath);
            const csvFiles = files.filter(isCSVFile);
            return csvFiles
                // queryRunner.commitTransaction()
            } catch (error) {
            console.error(`Error reading directory ${folderPath}:`, error);
            }
        };
        
        var csvFolderPath = path.resolve(__dirname, '../../sourceData/csv')
        const targetFolder = csvFolderPath;
        console.log("🌯")
        let csvFiles = await readCSVDirectory(targetFolder);
        for (let fileName of csvFiles) {
            const filePath = path.join(csvFolderPath, fileName);
            const csvData = await readCSVFile(filePath);
            console.log(`--- File: ${fileName} ---`); //Category name
            let keys=[]
            let characteristicsIds=[]
            // let characteristicsEntities=[]
            let first = true;
            //Create Characteristic rows
            for ( let key in csvData[0]){
                if (first) {
                    first = false;
                    continue;
                }
                keys.push(key)
                // let chara = await queryRunner.manager.create(Characteristic, {
                //     name: key,
                // })
                // characteristicsEntities.push(chara)
                // console.log(await queryRunner.manager.save(chara))
                let foundCharacteristic = await queryRunner.manager.findOne<Characteristic>(Characteristic,{ where:{
                    name: key,
                }});
                
                if (foundCharacteristic === null){
                    let insertedCharacteristic = await queryRunner.manager.insert<Characteristic>(Characteristic, {
                        name: key,
                    });
                    characteristicsIds.push(insertedCharacteristic.identifiers[0].id)}
                else
                    characteristicsIds.push(foundCharacteristic.id)
            }
            //Create Product rows
            for ( let product of csvData){

                let insertedProductResult = await queryRunner.manager.insert<Product>(Product, {
                    name: (product as any).name,
                    imgUrl: tempURL,
                });
                let productId = insertedProductResult.identifiers[0].id
                let insertedProduct = await queryRunner.manager.findOne<Product>(Product,{ where:{
                    id : productId
                }}); 
                // console.log(productId) 
                //Create ProductCharacterstic rows
                for (let i = 0; i < keys.length; i++) {
                    //Check if simmilar already exists
                    let foundProductCharacteristic = await queryRunner.manager.findOne<ProductCharacteristic>(ProductCharacteristic,{ where:{
                        value: (product[keys[i]] as any),
                        characteristic:  {id : characteristicsIds[i]},
                    }});
                    console.log("Found 🦊",foundProductCharacteristic)
                    if (foundProductCharacteristic === null){
                    // console.log("productId 🦊",productId)
                    let insertedProductCharacteristicResult = await queryRunner.manager.insert<ProductCharacteristic>(ProductCharacteristic, {
                        value: (product[keys[i]] as any),
                        characteristic: characteristicsIds[i],
                        products: [insertedProduct]
                    });}
                    else {
                        // console.log("🔑🦊",foundProductCharacteristic.products)
                        foundProductCharacteristic.products.push(insertedProduct)
                        await queryRunner.manager.save(foundProductCharacteristic)
                    }
                  }
            }
        }
    }   

    public async down(queryRunner: QueryRunner): Promise<void> {    

    }

}

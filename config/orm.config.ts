import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

dotenvConfig({ path: '.env' });

const ormConfig:TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.PORT || '5432'),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'pass123',
    database: process.env.DB_DATABASE || 'monodb',
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development' ? true : false,
}

export default ormConfig
export const connectionSource = new DataSource(ormConfig as DataSourceOptions);
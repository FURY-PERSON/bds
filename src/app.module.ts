import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'cccv',
      database: 'bds',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}

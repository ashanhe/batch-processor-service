import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CsvModule } from './csv/csv.module';
import { ExportModule } from './export/export.module';
import { NotificationGateway } from './notifications/notification.gateway';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'vehicle-db',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    CsvModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway],
})
export class AppModule {}

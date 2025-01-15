import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CsvService } from './csv.service';
import { CsvProcessor } from './csv.processor';
import { CsvController } from './csv.controller';
import { Vehicle } from './entities/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'csv-processing' }),
    TypeOrmModule.forFeature([Vehicle]),
    NotificationsModule
  ],
  controllers: [CsvController],
  providers: [CsvService, CsvProcessor],
  exports: [CsvService],
})
export class CsvModule {}

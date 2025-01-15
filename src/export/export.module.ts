import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportService } from './export.service';
import { ExportProcessor } from './export.processor';
import { ExportController } from './export.controller';
import { Vehicle } from '../csv/entities/vehicle.entity';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'export-processing' }),
    TypeOrmModule.forFeature([Vehicle]),
  ],
  controllers: [ExportController],
  providers: [ExportService, ExportProcessor],
})
export class ExportModule {}
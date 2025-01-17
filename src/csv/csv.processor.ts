import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { CsvService } from './csv.service';
@Processor('csv-processing')
export class CsvProcessor {
  constructor(private readonly csvService: CsvService) {}

  @Process('process-csv')
  async handleCsv(job: Job) {
    const { filePath } = job.data;
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          console.log('CSV data:', results);
          //create data on DB
          try {
            for (const vehicleData of results) {
              await this.csvService.create(vehicleData);
              console.log('Vehicle created:', vehicleData);
            }
            resolve(results);
          } catch (error) {
            console.error('Error saving CSV data:', error);

            reject(error);
          }
          resolve(results);
        })
        .on('error', (error) => {
          console.error('Error processing CSV:', error);

          reject(error);
        });
    });
  }
}

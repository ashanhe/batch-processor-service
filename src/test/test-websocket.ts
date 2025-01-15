import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { NotificationsGateway } from '../notifications/notifications.gateway';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const notificationsGateway = app.get(NotificationsGateway);

  // Simulate file export process
  console.log('Simulating file export...');
  notificationsGateway.sendNotification('File exported successfully');

  await app.close();
}

bootstrap();
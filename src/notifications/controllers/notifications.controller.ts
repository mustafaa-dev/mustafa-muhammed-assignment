import { Controller } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEvents } from '@app/common';
import { EmailDataInterface } from '../interfaces/email-data.interface';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @OnEvent(NotificationEvents.SEND_TASK_ASSIGNED_NOTIFICATION)
  async sendAssignedTaskEmail(data: EmailDataInterface) {
    await this.notificationService.sendAssignedTaskEmail(data);
  }
}

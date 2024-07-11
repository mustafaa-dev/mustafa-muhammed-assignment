import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { EmailDataInterface } from '../interfaces/email-data.interface';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  async sendAssignedTaskEmail(data: EmailDataInterface): Promise<void> {
    const msg = `A new task has been assigned to you with id: ${data.data.taskId} and title ${data.data.taskTitle}, sending email to ${data.to}`;
    console.log(msg);
    return await this.sendEmail(data.to, 'New Task Assigned', msg);
  }

  async sendCompletedTaskEmail(data: EmailDataInterface): Promise<void> {
    const msg = `A new task has been completed by user ${data.data.userName} with id: ${data.data.taskId} and title ${data.data.taskTitle}, sending email to ${data.to} and Admin`;
    console.log(msg);
    await this.sendEmail(
      this.configService.getOrThrow('MANAGER_EMAIL'),
      'New Task Completed',
      msg,
    );
    return await this.sendEmail(data.to, 'New Task Completed', msg);
  }

  async sendDoneTaskEmail(data: EmailDataInterface): Promise<void> {
    const msg = `Task ${data.data.taskId} with id ${data.data.taskId} has been closed sending email to ${data.to}`;
    console.log(msg);
    return await this.sendEmail(data.to, 'New Task Assigned', msg);
  }

  async sendEmail(to: any, subject: string, text: any) {
    const SENDGRID_API_KEY = this.configService.getOrThrow('SENDGRID_API_KEY');
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to,
      from: this.configService.getOrThrow('MANAGER_EMAIL'),
      subject,
      text,
    };
    sgMail.send(msg).then(() => {
      console.log('Email sent');
    });
  }
}

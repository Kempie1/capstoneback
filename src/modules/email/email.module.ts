import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule} from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MailerModule, ConfigModule.forRoot(),],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

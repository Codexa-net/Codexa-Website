import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../auth/auth.module';
import { AdminMessagesController } from './admin-messages.controller';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

function getPositiveIntegerConfig(
  configService: ConfigService,
  key: string,
  defaultValue: string,
): number {
  const value = Number(configService.get<string>(key, defaultValue));

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer.`);
  }

  return value;
}

@Module({
  imports: [
    AuthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: getPositiveIntegerConfig(
            configService,
            'CONTACT_RATE_LIMIT_TTL_MS',
            '60000',
          ),
          limit: getPositiveIntegerConfig(
            configService,
            'CONTACT_RATE_LIMIT_MAX',
            '5',
          ),
        },
      ],
    }),
  ],
  controllers: [ContactController, AdminMessagesController],
  providers: [ContactService],
})
export class ContactModule {}

import { ForgotPassword as ForgotPasswordDto } from '@/components/user/dto/forgot-password.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@/components/user/entities/user.entity';

@Injectable()
export class ForgotPasswordConverter {
    toDto(entity: User) {
        const dto = {
            email: entity.email,
        } as ForgotPasswordDto;

        return dto;
    }
}

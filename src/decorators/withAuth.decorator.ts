import { ApiBearerAuth } from '@nestjs/swagger';
import { applyDecorators, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../guard/auth.guard';

export function WithAuth() {
    return applyDecorators(
        UseGuards(JwtAuthenticationGuard),
        ApiBearerAuth('bearer'),
    );
}

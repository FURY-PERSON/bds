
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/guard/auth.guard';
import RoleGuard from 'src/guard/role.guard';

export function WithRole() {
    return applyDecorators(
        UseGuards(JwtAuthenticationGuard, RoleGuard),
        ApiBearerAuth('bearer'),
    );
}

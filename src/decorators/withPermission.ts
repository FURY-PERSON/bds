
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/guard/auth.guard';
import PermissionGuard from 'src/guard/permission.guard';

export function WithPermission() {
    return applyDecorators(
        UseGuards(JwtAuthenticationGuard, PermissionGuard),
        ApiBearerAuth('bearer'),
    );
}

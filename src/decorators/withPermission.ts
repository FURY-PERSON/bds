
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import PermissionGuard from 'src/guard/permission.guard';

export function WithPermission() {
    return applyDecorators(
        UseGuards(PermissionGuard),
        ApiBearerAuth('bearer'),
    );
}

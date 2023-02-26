
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import RoleGuard from 'src/guard/role.guard';

export function WithRole() {
    return applyDecorators(
        UseGuards(RoleGuard),
        ApiBearerAuth('bearer'),
    );
}

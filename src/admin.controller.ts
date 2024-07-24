import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from './decorators/roles/roles.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Role } from './enum/Role.enum';
import { AdminGuard } from './guards/admin/admin.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Roles(Role.Admin)
  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getHello(): string {
    return this.adminService.getHello();
  }
}

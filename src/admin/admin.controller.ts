import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from 'src/enum/Role-enum';

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

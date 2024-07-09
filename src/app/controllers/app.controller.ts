import { Controller, Get } from '@nestjs/common';
import { AppService } from '@app/services';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ description: 'Admin Login' })
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}

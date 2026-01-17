import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return { message: this.appService.getHello() };
  }

  @Get('/:id')
  getbye(@Param() id: string) {
    return { id: id ?? '', bye: this.appService.getBye() };
  }
}

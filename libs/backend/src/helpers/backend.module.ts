import { Get, Controller, Module } from '@nestjs/common';

@Controller()
export class backendC {
  @Get('/b')
  sayHello() {
    return { message: 'hi-hello' };
  }
}

@Module({
  controllers: [backendC],
  providers: [],
  exports: [],
})
export class BackendModule {}

import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  @OnEvent('TASK_CREATED')
  getHello(id: any): void {
    console.log('task created succesfully' + id);
  }
}

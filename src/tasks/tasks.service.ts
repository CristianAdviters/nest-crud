import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as fs from 'fs/promises';
import { DATABASE_PATH } from 'src/common/constants/global.constants';
import { TaskDto } from './dto/task.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TasksService {
  constructor(private eventEmitter: EventEmitter2) {}

  async create(task: CreateTaskDto) {
    const tasks: CreateTaskDto[] = await this.findAll();
    tasks.push(task);
    await fs.writeFile(DATABASE_PATH, JSON.stringify(tasks));
    // return 'This action adds a new task';

    this.eventEmitter.emit('TASK_CREATED', task);
  }

  async findAll() {
    const data = await fs.readFile(DATABASE_PATH);
    const tasks: TaskDto[] = JSON.parse(data.toString());
    const mappedTasks = tasks.map((task) => ({ ...task }));

    return mappedTasks;
  }

  async findAllPriority() {
    const tasks = await this.findAll();

    return tasks.sort((a, b) => b.priority - a.priority);
  }
  async findAllSchedule() {
    const tasks = await this.findAll();

    return tasks.sort((a, b) => {
      const date1 = new Date(a.scheduledTime).getTime() || 0;
      const date2 = new Date(b.scheduledTime).getTime() || 0;

      return date2 - date1;
    });

    //return tasks.sort((a, b) => b.scheduledTime - a.scheduledTime);
  }

  async findOne(id: number) {
    const tasks = await this.findAll();

    const task = tasks.find((t) => t.id === id);

    if (!task) throw new NotFoundException('error al buscar usuario');

    return task;
    // return `This action returns a #${id} task`;
  }

  async update(id: number, task: UpdateTaskDto) {
    const tasks = await this.findAll();
    const index = await tasks.findIndex((task) => task.id == id);

    console.log(tasks);
    console.log(tasks[index]);
    tasks[index] = { ...tasks[index], ...tasks };
    console.log(tasks);

    await fs.writeFile(DATABASE_PATH, JSON.stringify(tasks));
    return task;
    // return `This action updates a #${id} task`;
  }

  async remove(id: number) {
    const tasks = await this.findAll();
    const index = tasks.findIndex((t) => t.id == id);
    tasks.splice(index, 1);
    await fs.writeFile(DATABASE_PATH, JSON.stringify(tasks));

    if (!tasks[index]) throw new BadRequestException('error al buscar task');

    return tasks;
    // return `This action removes a #${id} task`;
  }
}

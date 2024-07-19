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

@Injectable()
export class TasksService {
  async create(task: CreateTaskDto) {
    const tasks: CreateTaskDto[] = await this.findAll();
    tasks.push(task);
    await fs.writeFile(DATABASE_PATH, JSON.stringify(tasks));
    // return 'This action adds a new task';
  }

  async findAll() {
    const data = await fs.readFile(DATABASE_PATH);
    const tasks: TaskDto[] = JSON.parse(data.toString());
    return tasks.map((task) => ({ ...task }));
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
  sortById(id: number) {
    return `sort by id`;
  }
}

import { v4 as uuidv4 } from 'uuid';

export class CreateTaskDto {
  id: number;
  name: string;
  description: string;
  scheduledTime?: number;
  priority?: number;
}

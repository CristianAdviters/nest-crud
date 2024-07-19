import { IsDateString, IsOptional } from 'class-validator';
import { isDate } from 'util/types';
import { v4 as uuidv4 } from 'uuid';

export class CreateTaskDto {
  id: number;
  name: string;
  description: string;

  @IsOptional()
  @IsDateString()
  scheduledTime?: string;

  @IsOptional()
  priority?: number;
}

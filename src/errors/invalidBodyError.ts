import { ApplicationError } from '../protocols';

export function invalidBodyError(message: string): ApplicationError {
  return {
    name: 'InvalidData',
    message,
  };
}

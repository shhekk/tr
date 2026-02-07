import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function Range(min: number, max: number, options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Range',
      target: object.constructor,
      propertyName,
      constraints: [min, max],
      options,
      validator: {
        validate(incoming: any, args: ValidationArguments) {
          const [min, max] = args.constraints;
          return (
            typeof incoming === 'number' && incoming >= min && incoming <= max
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [min, max] = args.constraints;
          return `${args.property} must be between ${min} and ${max}`;
        },
      },
    });
  };
}

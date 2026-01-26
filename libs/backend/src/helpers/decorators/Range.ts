import { Min, Max } from 'class-validator';

export function Range(min: number, max: number): PropertyDecorator {
  return function (target, propertyKey) {
    Min(min)(target, propertyKey); // Min/Max itself is a higher order function which need (target, propertyKey)
    Max(max)(target, propertyKey);
  };
}

/**
 * to create a property key return the *property decorator signrature* which looks like:
 * type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
 */

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ExpenseTypes } from '../enums';

export function IsForSubscriptionType(acceptedValues: any[], validationOptions?: ValidationOptions) {
  const property = 'type';
  validationOptions = { ...validationOptions, message: `installment value must be in [${acceptedValues}] if type 'subcription' is selected` };
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isForPurchaseType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (relatedValue !== ExpenseTypes.subscription) return true;
          return relatedValue === ExpenseTypes.subscription && acceptedValues.includes(value);
        },
      },
    });
  };
}

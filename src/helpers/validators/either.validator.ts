import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments
} from 'class-validator';

export function IsUsernameOrEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUsernameOrEmail',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const { object } = args;
                    const username = object['username'];
                    const email = object['email'];
                    return username || email;
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Either username or email is required';
                },
            },
        });
    };
}

import {
  Entity,
  ObjectIdColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as uuid from 'uuid';
import { hash, compare } from 'bcrypt';
import {
  IsString,
  IsNotEmpty,
  Length,
  // MinLength,
  // IsBoolean,
  IsArray,
  IsEmail,
  // IsNumber
} from 'class-validator';

enum Gender {
  MALE,
  FEMALE,
}

export class LoginUserInput {
  @IsEmail(undefined, { message: 'Your email can not be blank' })
  @IsNotEmpty({ message: 'Your email can not be blank' })
  email: string;

  @Length(1, 8, {
    message: 'Your password must be between 1 and 8 characters',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserInput {
  @Length(3, 20, {
    message: 'Your fullName must be between 3 and 20 characters',
  })
  @IsString()
  @IsNotEmpty({ message: 'Your firstName can not be blank' })
  firstName: string;

  @Length(3, 20, {
    message: 'Your fullName must be between 3 and 20 characters',
  })
  @IsString()
  @IsNotEmpty({ message: 'Your lastName can not be blank' })
  lastName: string;

  @IsEmail(undefined, { message: 'Your email can not be blank' })
  @IsNotEmpty({ message: 'Your email can not be blank' })
  email: string;

  @Length(1, 8, {
    message: 'Your password must be between 1 and 8 characters',
  })
  @IsNotEmpty({ message: 'Your password can not be blank' })
  password: string;

  @IsNotEmpty({ message: 'Your gender can not be blank' })
  gender: Gender;
}

export class UpdateUserInput {
  @Length(3, 20, {
    message: 'Your fullName must be between 3 and 20 characters',
  })
  @IsString()
  firstName: string;

  @Length(3, 20, {
    message: 'Your fullName must be between 3 and 20 characters',
  })
  @IsString()
  lastName: string;

  @Length(1, 8, {
    message: 'Your password must be between 1 and 8 characters.',
  })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Your gender can not be blank' })
  gender: Gender;
}

export class LoginResponse {
  @IsString()
  @IsNotEmpty()
  token: string;
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  resetPasswordToken: string;

  @Column()
  resetPasswordExpires: number;

  @Column()
  @IsNotEmpty()
  gender: Gender;

  @Column()
  @IsNotEmpty()
  isLocked: boolean;

  @Column()
  reason: string;

  @Column()
  @IsNotEmpty()
  isActive: boolean;

  @Column()
  createdAt: number;
  @Column()
  updatedAt: number;

  @BeforeInsert()
  save() {
    this._id = uuid.v1();
    this.password = hash(this.password, 10);
    this.isLocked = false;
    this.reason = '';
    this.isActive = true;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }

  @BeforeUpdate()
  update() {
    this.updatedAt = new Date().getTime();
  }

  hashPassword(password) {
    return hash(password, 10);
  }

  matchesPassword(password) {
    return compare(password, this.password);
  }
}
import { compare, hash } from 'bcrypt';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { from, Observable } from 'rxjs';
import { Sex } from '../shared/enum/sex.enum';
import { RoleType } from '../shared/enum/role-type.enum';
interface User extends Document {
  comparePassword(password: string): Observable<boolean>;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly fullName: string;
  readonly roles?: RoleType[];
  readonly city: string;
  readonly phone: string;
  readonly avatar: string;
  readonly sex: Sex;
}

type UserModel = Model<User>;

const UserSchema = new Schema(
  {
    username: SchemaTypes.String,
    password: SchemaTypes.String,
    email: SchemaTypes.String,
    fullName: SchemaTypes.String,
    city: SchemaTypes.String,
    phone: SchemaTypes.String,
    avatar: SchemaTypes.String,
    sex: SchemaTypes.String,
    roles: [
      { type: SchemaTypes.String, enum: ['ADMIN', 'USER'], required: false },
    ],
    // use timestamps option to generate it automaticially.
    //   createdAt: { type: SchemaTypes.Date, required: false },
    //   updatedAt: { type: SchemaTypes.Date, required: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// see: https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/
// and https://stackoverflow.com/questions/48023018/nodejs-bcrypt-async-mongoose-login
async function preSaveHook(next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password
  const password = await hash(this.password, 12);
  this.set('password', password);

  next();
}

UserSchema.pre<User>('save', preSaveHook);

function comparePasswordMethod(password: string): Observable<boolean> {
  return from<Observable<boolean>>(compare(password, this.password));
}

UserSchema.methods.comparePassword = comparePasswordMethod;

// function nameGetHook() {
//   return `${this.fullName} ${this.lastName}`;
// }

// UserSchema.virtual('name').get(nameGetHook);

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'createdBy',
});

const userModelFn: (conn: Connection) => UserModel = (conn: Connection) =>
  conn.model<User>('User', UserSchema, 'users');

export {
  User,
  UserModel,
  UserSchema,
  preSaveHook,
  // nameGetHook,
  comparePasswordMethod,
  userModelFn,
};

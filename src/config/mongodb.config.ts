import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  uri:
    process.env.MONGODB_URI ||
    `mongodb+srv://atom:atom123@cluster0.x3p5o.mongodb.net/atom?retryWrites=true&w=majority`,
}));

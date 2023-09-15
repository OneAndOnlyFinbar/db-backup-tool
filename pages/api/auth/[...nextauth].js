import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import User from '@/lib/db/user';
import { Op } from 'sequelize';

const bcrypt = require('bcryptjs');

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await User.findOne({
          where: {
            [Op.or]: [
              { name: credentials.email },
              { email: credentials.email }
            ]
          }
        })

        if (user && bcrypt.compareSync(credentials.password, user.password))
          return user;

        return null;
      }
    })
  ],
})

export default handler;
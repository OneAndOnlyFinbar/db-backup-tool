import Database from '@/lib/db/database';
import Server from '@/lib/db/server';
import User from '@/lib/db/user';

Server.hasMany(Database, {
  foreignKey: 'serverId',
  as: 'databases',
});

Database.belongsTo(Server);

export {
  Database,
  Server,
  User,
}
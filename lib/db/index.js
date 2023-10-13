import Database from '@/lib/db/database';
import Server from '@/lib/db/server';
import User from '@/lib/db/user';
import Backup from "@/lib/db/backups";

Server.hasMany(Database, {
  foreignKey: 'serverId',
  as: 'databases',
});

Database.belongsTo(Server);

Database.hasMany(Backup, {
  foreignKey: 'serverId',
  as: 'backups',
})

Backup.belongsTo(Database);

export {
  Database,
  Server,
  User,
  Backup
}
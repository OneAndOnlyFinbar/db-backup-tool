import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/lib/db/sequelize';
import Server from '@/lib/db/server'; // Import Server after it's defined

export class Database extends Model {
  serverId;
  tracked;
  name;
  tableCount;
  retentionPeriod;
  backupFrequency;
  lastBackup;
}

Database.init({
  serverId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  tracked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  tableCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  retentionPeriod: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  retentionUnit: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  backupFrequency: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  backupUnit: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  lastBackup: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'dbs',
  timestamps: false,
});

Database.removeAttribute('id');

export default Database;
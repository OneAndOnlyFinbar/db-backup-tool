import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/lib/db/sequelize';

export class Backups extends Model {
  id;
  serverId;
  db;
  date;
  deleteAfter;
}

Backups.init({
  id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    primaryKey: true,
  },
  serverId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  db: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  deleteAfter: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'backups',
  timestamps: false,
});

export default Backups;
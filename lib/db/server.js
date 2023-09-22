import { sequelize } from '@/lib/db/sequelize';
import { Model, DataTypes } from 'sequelize';

export class Server extends Model {
  id;
  ip;
  port;
}

Server.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ip: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  port: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'servers',
  timestamps: false,
});

export default Server;
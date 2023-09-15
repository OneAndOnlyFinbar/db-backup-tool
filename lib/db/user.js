import { sequelize } from '@/lib/db/sequelize';
import { Model, DataTypes } from 'sequelize';

export class User extends Model {
  id;
  name;
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: false,
})

export default User;
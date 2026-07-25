import type { Access, CollectionConfig, FieldAccess } from 'payload'

/**
 * Роли: admin — полный доступ (включая управление пользователями),
 * editor — работа с контентом (все глобалы, статьи, медиа), но не с учётками.
 * Разграничение здесь, контентные коллекции для обеих ролей открыты одинаково:
 * реальная граница системы — управление доступом, а не контент.
 */
const isAdmin: Access = ({ req }) => req.user?.role === 'admin'
const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

/** Админ видит/правит всех, редактор — только собственную учётку. */
const adminOrSelf: Access = ({ req }) =>
  req.user?.role === 'admin' ? true : { id: { equals: req.user?.id ?? '' } }

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
      ],
      // Роль попадает в JWT — access-проверки не ходят в БД
      saveToJWT: true,
      access: {
        // Повышать/понижать роль может только админ (в т.ч. свою — осознанно)
        create: isAdminField,
        update: isAdminField,
      },
      label: 'Роль',
    },
  ],
  versions: false,
}

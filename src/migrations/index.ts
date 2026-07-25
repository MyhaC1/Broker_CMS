import * as migration_20260725_154032_init_multitenant from './20260725_154032_init_multitenant';

export const migrations = [
  {
    up: migration_20260725_154032_init_multitenant.up,
    down: migration_20260725_154032_init_multitenant.down,
    name: '20260725_154032_init_multitenant'
  },
];

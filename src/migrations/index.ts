import * as migration_20260725_154032_init_multitenant from './20260725_154032_init_multitenant';
import * as migration_20260725_163338_cabinet_home from './20260725_163338_cabinet_home';

export const migrations = [
  {
    up: migration_20260725_154032_init_multitenant.up,
    down: migration_20260725_154032_init_multitenant.down,
    name: '20260725_154032_init_multitenant',
  },
  {
    up: migration_20260725_163338_cabinet_home.up,
    down: migration_20260725_163338_cabinet_home.down,
    name: '20260725_163338_cabinet_home'
  },
];

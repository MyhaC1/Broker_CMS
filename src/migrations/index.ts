import * as migration_20260725_154032_init_multitenant from './20260725_154032_init_multitenant';
import * as migration_20260725_163338_cabinet_home from './20260725_163338_cabinet_home';
import * as migration_20260727_095512_allow_list from './20260727_095512_allow_list';

export const migrations = [
  {
    up: migration_20260725_154032_init_multitenant.up,
    down: migration_20260725_154032_init_multitenant.down,
    name: '20260725_154032_init_multitenant',
  },
  {
    up: migration_20260725_163338_cabinet_home.up,
    down: migration_20260725_163338_cabinet_home.down,
    name: '20260725_163338_cabinet_home',
  },
  {
    up: migration_20260727_095512_allow_list.up,
    down: migration_20260727_095512_allow_list.down,
    name: '20260727_095512_allow_list'
  },
];

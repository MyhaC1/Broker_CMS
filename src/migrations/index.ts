import * as migration_20260725_074120_initial from './20260725_074120_initial';
import * as migration_20260725_113548_sites from './20260725_113548_sites';

export const migrations = [
  {
    up: migration_20260725_074120_initial.up,
    down: migration_20260725_074120_initial.down,
    name: '20260725_074120_initial',
  },
  {
    up: migration_20260725_113548_sites.up,
    down: migration_20260725_113548_sites.down,
    name: '20260725_113548_sites'
  },
];

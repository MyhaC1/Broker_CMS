import * as migration_20260725_074120_initial from './20260725_074120_initial';

export const migrations = [
  {
    up: migration_20260725_074120_initial.up,
    down: migration_20260725_074120_initial.down,
    name: '20260725_074120_initial'
  },
];

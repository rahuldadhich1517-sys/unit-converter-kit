import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'area-convert/index': 'src/area-convert/index.ts',
    'data-storage-convert/index': 'src/data-storage-convert/index.ts',
    'file-size-convert/index': 'src/file-size-convert/index.ts',
    'energy-convert/index': 'src/energy-convert/index.ts',
    'length-convert/index': 'src/length-convert/index.ts',
    'power-convert/index': 'src/power-convert/index.ts',
    'pressure-convert/index': 'src/pressure-convert/index.ts',
    'speed-convert/index': 'src/speed-convert/index.ts',
    'temperature-convert/index': 'src/temperature-convert/index.ts',
    'volume-convert/index': 'src/volume-convert/index.ts',
    'weight-convert/index': 'src/weight-convert/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  target: 'es2022',
  outDir: 'dist'
});

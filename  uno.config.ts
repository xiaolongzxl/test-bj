// uno.config.ts
import { defineConfig } from 'unocss';
import presetAttributify from '@unocss/preset-attributify';
export default defineConfig({
  presets: [
    presetAttributify(), // 属性化模式支持
  ],
  rules: [
    [
      /^paa-(\d+)$/,
      (match) => {
        console.log(`Applying padding rule with value ${match[1]}px`);
        return { padding: `${match[1]}px` };
      },
    ],
    [/^ma-(\d+)$/, (match) => ({ margin: `${match[1]}px` })],
    [/^pa-(\d+)$/, (match) => ({ padding: `${match[1]}px` })],
    [/^px-(\d+)$/, (match) => ({ 'padding-left': `${match[1]}px`, 'padding-right': `${match[1]}px` })],
    [/^py-(\d+)$/, (match) => ({ 'padding-top': `${match[1]}px`, 'padding-bottom': `${match[1]}px` })],
    [/^mx-(\d+)$/, (match) => ({ 'margin-left': `${match[1]}px`, 'margin-right': `${match[1]}px` })],
    [/^my-(\d+)$/, (match) => ({ 'margin-top': `${match[1]}px`, 'margin-bottom': `${match[1]}px` })],
    [/^pt-(\d+)$/, (match) => ({ 'padding-top': `${match[1]}px` })],
    [/^pb-(\d+)$/, (match) => ({ 'padding-bottom': `${match[1]}px` })],
    [/^pl-(\d+)$/, (match) => ({ 'padding-left': `${match[1]}px` })],
    [/^pr-(\d+)$/, (match) => ({ 'padding-right': `${match[1]}px` })],
    [/^mt-(\d+)$/, (match) => ({ 'margin-top': `${match[1]}px` })],
    [/^mb-(\d+)$/, (match) => ({ 'margin-bottom': `${match[1]}px` })],
    [/^ml-(\d+)$/, (match) => ({ 'margin-left': `${match[1]}px` })],
    [/^mr-(\d+)$/, (match) => ({ 'margin-right': `${match[1]}px` })],
  ],
  shortcuts: {
    'flex-between': 'flex justify-between items-center',
    'flex-center': 'flex justify-center items-center',
    'flex-start': 'flex justify-start items-center',
    'flex-end': 'flex justify-end items-center',
    'flex-columns': 'flex justify-end items-center flex-col',
    'text-overflow': 'truncate',
    'wh-full': 'w-full h-full',
  },
});

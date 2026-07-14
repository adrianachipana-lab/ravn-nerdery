import { TaskTag } from '../types/task';

export function getTagLabel(tag: typeof TaskTag[keyof typeof TaskTag]): string {
  const map: Record<string, string> = {
    [TaskTag.ANDROID]: 'Android',
    [TaskTag.IOS]: 'iOS',
    [TaskTag.NODE_JS]: 'Node.js',
    [TaskTag.RAILS]: 'Rails',
    [TaskTag.REACT]: 'React',
  };
  return map[tag];
}

export function getTagClassName(tag: typeof TaskTag[keyof typeof TaskTag]): string {
  const map: Record<string, string> = {
    [TaskTag.ANDROID]: 'android',
    [TaskTag.IOS]: 'ios',
    [TaskTag.NODE_JS]: 'nodejs',
    [TaskTag.RAILS]: 'rails',
    [TaskTag.REACT]: 'react',
  };
  return map[tag];
}

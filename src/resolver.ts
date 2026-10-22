/**
 * Aero UI Resolver —— 仿 ArcoResolver 模式
 * 用于 unplugin-vue-components 按需自动导入：
 *
 * import { AeroUIResolver } from 'aero-vue/resolver'
 * Components({ resolvers: [AeroUIResolver()] })
 */
import type { ComponentResolver } from 'unplugin-vue-components'

export function AeroUIResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^Aero[A-Z]/)) {
        const partialName = name.slice(4) // 去掉 Aero 前缀 -> Button / InputTag ...
        // PascalCase -> kebab-case
        const kebab = partialName
          .replace(/([A-Z])/g, (m) => '-' + m.toLowerCase())
          .replace(/^-/, '')
        return {
          name: 'Aero' + partialName,
          from: 'aero-vue',
          sideEffects: `aero-vue/styles`,
        }
      }
    },
  }
}

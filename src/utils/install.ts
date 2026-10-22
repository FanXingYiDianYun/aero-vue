import type { App, Component } from 'vue'

export type SFCWithInstall<T> = T & {
  install(app: App): void
}

/**
 * 为组件附加 install 方法，支持 app.use(AeroButton) 单组件注册
 */
export function withInstall<T extends Component>(comp: T, name?: string): SFCWithInstall<T> {
  const c = comp as SFCWithInstall<T>
  c.install = (app: App) => {
    app.component(name ?? (c.name ?? ''), c)
  }
  return c
}

/**
 * AeroUI 组件文案 i18n（对标 EP useLocale）
 *
 * 设计：
 * - provide/inject：AeroConfigProvider locale prop（'zh-cn' | 'en-us'，默认 zh-cn）
 *   通过 inject(AEROS_LOCALE_KEY) 向下传递文案对象
 * - 无 ConfigProvider 包裹时回落 zh-cn 默认词包（库默认中文）
 * - 组件内 useLocale().cropper 消费；cropper labels prop 优先级最高（覆盖词包）
 *
 * 用法（组件内）：
 *   const { locale, cropper } = useLocale()
 *   const labels = computed(() => ({ ...cropper.value, ...props.labels }))
 *
 * 用法（库外注入）：
 *   <AeroConfigProvider locale="en-us">...</AeroConfigProvider>
 */
import { computed, inject, type ComputedRef } from 'vue'
import { zhCn, type LocaleMessages } from './zh-cn'
import { enUs } from './en-us'

export type { LocaleMessages } from './zh-cn'
export { zhCn } from './zh-cn'
export { enUs } from './en-us'

export type LocaleName = 'zh-cn' | 'en-us'

export interface UseLocaleResultBase {
  /** 当前 locale 名 */
  locale: ComputedRef<LocaleName>
  /** 当前 locale 全量词包（组件内 t('cropper.upload') 等价） */
  messages: ComputedRef<LocaleMessages>
}
/** 按词包键动态生成的各组 ComputedRef（useLocale() 内 Object.keys(zhCn) 遍历补齐） */
type UseLocaleGroups = { [K in keyof LocaleMessages]: ComputedRef<LocaleMessages[K]> }
/** useLocale() 返回：基础两字段 + 全量词包组 */
export type UseLocaleResult = UseLocaleResultBase & UseLocaleGroups

export const AEROS_LOCALE_KEY = 'AeroLocale'
export type AEROS_LOCALE_INJECT = { locale: ComputedRef<LocaleName> }

/** 词包注册表 */
export const locales: Record<LocaleName, LocaleMessages> = {
  'zh-cn': zhCn,
  'en-us': enUs,
}

/**
 * useLocale —— 组件内调用；
 * 有 AeroConfigProvider locale 注入时跟随，无则回落 zh-cn
 */
export function useLocale(): UseLocaleResult {
  const injected = inject<AEROS_LOCALE_INJECT | null>(AEROS_LOCALE_KEY, null)
  const locale = computed<LocaleName>(() => injected?.locale.value ?? 'zh-cn')
  const messages = computed<LocaleMessages>(() => locales[locale.value] ?? zhCn)
  const out = {
    locale,
    messages,
  } as unknown as UseLocaleResult
  // 按词包键动态生成各组 ComputedRef（全组件键，免逐组手写）；
  // 组值类型经 messages.value[key] 收窄为 LocaleMessages[keyof]，此处 as 断言回填
  for (const key of Object.keys(zhCn) as (keyof LocaleMessages)[]) {
    const group = computed(() => messages.value[key])
    ;(out as unknown as Record<string, unknown>)[key] = group
  }
  return out
}

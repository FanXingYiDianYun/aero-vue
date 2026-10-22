# AeroUpload（upload）

分组：Form 表单
中文名：上传

具名导入：

```ts
import { AeroUpload } from 'aero-vue'
```

## props
| prop | 类型 | 默认 |
|---|---|---|
| `modelValue` | UploadFile[] | — |
| `drag` | boolean | false |
| `multiple` | boolean | false |
| `accept` | string | — |
| `disabled` | boolean | false |
| `limit` | number | 0 |
| `name` | string | 'file' |
| `withCredentials` | boolean | false |
| `showFileList` | boolean | true |
| `listType` | 'text'|'picture'|'picture-card' | 'text' |
| `tip` | string | — |
| `beforeUpload` | BeforeUploadHook | — |
| `beforeRemove` | (f: UploadFile) => false | void | Promise<false | void> | — |

## events
| event | payload |
|---|---|
| `change` | File[] |
| `remove` | UploadFile |
| `update:modelValue` | UploadFile[] |
| `exceed` | File[] |
| `preview` | UploadFile |
| `upload` | File |
| `success` | UploadFile |
| `progress` | UploadFile |
| `error` | UploadFile |

## 最小示例（源自 demo/basic.vue）
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AeroUpload } from 'aero-vue'
import type { UploadFile } from 'aero-vue'

const files = ref<UploadFile[]>([])
</script>
<template>
  <!-- 外层 wrapper 是 .pg-stage 的 flex item（min-width:auto 链路第三次撞）——
 加 min-width:0 让 AeroUpload 内 max-width:100% 收缩到「宿主内容宽 316px」，
 长文件名在名称层 ellipsis，不撑出 demo 卡、不出页面横滚。
 max-width:400px 桌面定宽保留（宿主充足时仍 400px，短名像素不变）。 -->
  <div style="display: flex; flex-direction: column; gap: 18px; max-width: 400px; min-width: 0">
    <AeroUpload v-model="files" drag multiple accept="image/*" />
    <AeroUpload v-model="files" />
  </div>
</template>
```
完整示例源码：https://github.com/FanXingYiDianYun/aero-vue/blob/main/src/components/upload/demo/basic.vue


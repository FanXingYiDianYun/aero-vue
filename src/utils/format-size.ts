/**
 * 文件大小格式化（阶段5 去重项 3）
 * KB/MB 两档，与 upload 组件内联实现等价
 */
export function formatSize(b: number): string {
  return b > 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB' : (b / 1024).toFixed(0) + ' KB'
}

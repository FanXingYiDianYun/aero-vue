/**
 * 迷你语法高亮器（demo highlight() 同源思路）
 * 以 <span class="tk-*"> 包裹 token，颜色全部走 --ui-tk-* 变量
 */

type Rule = { re: RegExp; cls: string }

// 通用 token 规则（顺序敏感：先匹配先胜出）
const rules: Rule[] = [
  { re: /^\/\/[^\n]*/, cls: 'tk-c' }, // 行注释
  { re: /^#[^\n]*/, cls: 'tk-c' }, // shell 注释
  { re: /^\/\*[\s\S]*?\*\//, cls: 'tk-c' }, // 块注释
  { re: /^"(?:[^"\\]|\\.)*"/, cls: 'tk-s' }, // 双引号字符串
  { re: /^'(?:[^'\\]|\\.)*'/, cls: 'tk-s' }, // 单引号字符串
  { re: /^`(?:[^`\\]|\\.)*`/, cls: 'tk-s' }, // 模板字符串
  { re: /^\b(0x[\da-fA-F]+|\d+(?:\.\d+)?(?:e\d+)?)\b/, cls: 'tk-n' }, // 数字
  { re: /^\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|extends|new|async|await|try|catch|throw|typeof|interface|type|enum|public|private|readonly|switch|case|break|continue|do|in|of|this|null|undefined|true|false)\b/, cls: 'tk-k' }, // 关键字
  { re: /^\b(fn|pub|use|mod|struct|impl|match|Self)\b/, cls: 'tk-k' }, // 其他语言关键字
  { re: /^[A-Za-z_$][\w$]*(?=\s*\()/, cls: 'tk-f' }, // 函数调用
  { re: /^[A-Z][\w$]*/, cls: 'tk-k2' }, // 类型/常量
  { re: /^[A-Za-z_$][\w$]*/, cls: 'tk-v' }, // 变量
]

/** 高亮单行：返回 HTML 片段（token 均已转义） */
export function highlightLine(line: string): string {
  let src = line
  let out = ''
  while (src.length) {
    // 空白快进
    const ws = /^\s+/.exec(src)
    if (ws) {
      out += ws[0]
      src = src.slice(ws[0].length)
      continue
    }
    let matched = false
    for (const r of rules) {
      const m = r.re.exec(src)
      if (m && m[0]) {
        out += `<span class="${r.cls}">${escapeHtml(m[0])}</span>`
        src = src.slice(m[0].length)
        matched = true
        break
      }
    }
    if (!matched) {
      // 标点快进到下一个非标点
      const p = /^[^\w\s"'`#]+/.exec(src)
      const chunk = p ? p[0] : src[0]
      out += escapeHtml(chunk)
      src = src.slice(chunk.length)
    }
  }
  return out
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

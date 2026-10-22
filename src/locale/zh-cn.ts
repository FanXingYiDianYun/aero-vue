/**
 * AeroUI 默认词包（zh-cn）—— 对标 EP useLocale 的组件文案集合。
 * 各组件 t('key') 消费；cropper 通过 useLocale().labels 读取，
 * 组件 labels prop 优先级更高（覆盖词包）。
 *
 * 词包由 10 组扩至全组件——组件 src 不再保留任何非注释 CJK 字面量
 * （验收：grep '[一-龥]' 库 src 排除注释与 locale/ = 0）。
 * 动态文案（"第 N 页"等）一律结构化为带参函数，禁止组件内拼接句子。
 */
export interface LocaleMessages {
  common: {
    close: string
    loading: string
    now: string
  }
  cropper: {
    upload: string
    enlarge: string
    shrink: string
    rotate90: string
    reset: string
    export: string
    hint: string
    empty: string
    ready: string
    /** 画布 meta 行（框尺寸 + 旋转角） */
    metaFrame: (size: number, rot: number) => string
  }
  code: {
    copy: string
    copied: string
    /** CodeBlock 折叠钮 aria-label */
    expand: string
    collapse: string
  }
  pagination: {
    prev: string
    next: string
    /** 跳转器引导词（「前往 N」/ "Go to N"） */
    go: string
    /** 总数单位（「N 页」/ "N pages"） */
    page: string
    confirm: string
    /** 跳转 input aria-label */
    jumpAria: (pages: number) => string
  }
  upload: {
    select: string
    dragTitle: string
    /** 拖拽区副行模板（accept 或任意类型） */
    dragSub: (accept: string) => string
    anyType: string
    previewAria: string
    removeAria: string
  }
  empty: {
    /** hint 缺省标题 */
    hint: string
    /** 默认 slot 回落正文 */
    text: string
    /** demo 场景：搜索空态 */
    search: string
    /** demo 场景：重置筛选按钮 */
    reset: string
  }
  select: {
    placeholder: string
  }
  table: {
    empty: string
  }
  transfer: {
    source: string
    target: string
    toRightAria: string
    toLeftAria: string
  }
  toast: {
    closeAria: string
  }
  // —— J5 全组件补全 ——
  dialog: {
    /** aria-label 缺省（未传 title） */
    label: string
  }
  drawer: {
    label: string
  }
  messageBox: {
    title: string
    confirm: string
    cancel: string
  }
  popconfirm: {
    title: string
    dangerTitle: string
    confirm: string
    cancel: string
  }
  carousel: {
    pageAria: (n: number) => string
  }
  cascader: {
    placeholder: string
    all: string
  }
  datePicker: {
    placeholder: string
    prevMonth: string
    nextMonth: string
    prevYear: string
    nextYear: string
    prevDecade: string
    nextDecade: string
    monthName: (m: number) => string
    weekday: (i: number) => string
    /** 面板标题：day=「y 年 m 月」/ month=「y 年」 */
    title: (mode: 'day' | 'month', y: number, m: number) => string
  }
  timePicker: {
    placeholder: string
  }
  tour: {
    skip: string
    next: string
    done: string
  }
  search: {
    placeholder: string
    empty: string
    other: string
    clearAria: string
  }
  themeSwitch: {
    /** aria-label 专用（switchToLight / switchToDark，zh/en 各 1 键） */
    switchToLight: string
    switchToDark: string
  }
  image: {
    lost: string
    retry: string
  }
  imageViewer: {
    zoomOut: string
    zoomIn: string
    rotateLeft: string
    rotateRight: string
    reset: string
    prev: string
    next: string
  }
  rate: {
    starAria: (n: number) => string
  }
  qrcode: {
    aria: (value: string) => string
  }
  otp: {
    slotAria: (i: number) => string
  }
  slideGo: {
    text: string
    done: string
    aria: string
  }
  swipeDeck: {
    go: string
    back: string
    ok: string
  }
  sortList: {
    handle: string
  }
  tree: {
    expandAria: (label: string) => string
    checkAria: (label: string) => string
  }
  input: {
    clearAria: string
  }
  inputNumber: {
    minusAria: string
    plusAria: string
  }
  inputTag: {
    placeholder: string
    removeAria: (tag: string) => string
  }
  autocomplete: {
    placeholder: string
  }
  mention: {
    placeholder: string
  }
  treeSelect: {
    placeholder: string
  }
  alert: {
    closeAria: string
  }
  announce: {
    closeAria: string
  }
  anchor: {
    navAria: string
  }
  backTop: {
    aria: string
  }
  breadcrumb: {
    navAria: string
  }
  notification: {
    closeAria: string
  }
  pageHeader: {
    backAria: string
  }
  parallaxBox: {
    hint: string
  }
  bottomSheet: {
    bgTitle: string
    bgHint: string
  }
  actionButtons: {
    reject: string
    accept: string
  }
  /** demo 页文案：demo.<component>.<token>（J5A.4 红线：库 src 非注释行 0 CJK，
   * demo 的提示/按钮/数据样张全量收进词包，自由键避免逐组件接口爆炸） */
  demo: DemoMessages
}

/** demo 组自由键（值：静态文案；带动态值的句子拆「键 + 插值」，禁止整句进词包） */
export interface DemoMessages {
  [key: string]: string
}

export const zhCn: LocaleMessages = {
  common: {
    close: '关闭',
    loading: '加载中',
    now: '现在',
  },
  cropper: {
    upload: '上传图片',
    enlarge: '放大',
    shrink: '缩小',
    rotate90: '转 90°',
    reset: '重置',
    export: '裁剪并导出',
    hint: '拖中间移动 · 拖角放大缩小 · 拖边旋转 · 圆形即头像裁取区',
    empty: '上传图片后开始裁剪',
    ready: '尚未上传图片',
    metaFrame: (size, rot) => `框 ${Math.round(size)}px · 旋转 ${Math.round(rot)}°`,
  },
  code: {
    copy: '复制',
    copied: '已复制',
    expand: '展开代码',
    collapse: '收起代码',
  },
  pagination: {
    prev: '上一页',
    next: '下一页',
    go: '前往',
    page: '页',
    confirm: '确定',
    jumpAria: (pages) => `跳转到页码（共 ${pages} 页）`,
  },
  upload: {
    select: '选择文件',
    dragTitle: '拖拽文件至此',
    dragSub: (accept) => `或点击选择（${accept}）`,
    anyType: '任意类型',
    previewAria: '预览',
    removeAria: '移除',
  },
  empty: {
    hint: '暂无数据',
    text: '这里空空如也，什么都没有',
    search: '没有找到结果',
    reset: '重置筛选',
  },
  select: {
    placeholder: '请选择',
  },
  table: {
    empty: '暂无数据',
  },
  transfer: {
    source: '来源',
    target: '目标',
    toRightAria: '右移',
    toLeftAria: '左移',
  },
  toast: {
    closeAria: '关闭',
  },
  dialog: {
    label: '对话框',
  },
  drawer: {
    label: '抽屉',
  },
  messageBox: {
    title: '请确认',
    confirm: '确定',
    cancel: '取消',
  },
  popconfirm: {
    title: '确定执行此操作？',
    dangerTitle: '危险操作',
    confirm: '确定',
    cancel: '取消',
  },
  carousel: {
    pageAria: (n) => `第 ${n} 页`,
  },
  cascader: {
    placeholder: '请选择',
    all: '全部',
  },
  datePicker: {
    placeholder: '选择日期',
    prevMonth: '上个月',
    nextMonth: '下个月',
    prevYear: '上一年',
    nextYear: '下一年',
    prevDecade: '前 12 年',
    nextDecade: '后 12 年',
    monthName: (m) => `${m}月`,
    weekday: (i) => ['一', '二', '三', '四', '五', '六', '日'][i],
    title: (mode, y, m) => (mode === 'day' ? `${y} 年 ${m} 月` : `${y} 年`),
  },
  timePicker: {
    placeholder: '选择时间',
  },
  tour: {
    skip: '跳过',
    next: '下一步',
    done: '完成',
  },
  search: {
    placeholder: '搜索…',
    empty: '无匹配结果',
    other: '其他',
    clearAria: '清除',
  },
  themeSwitch: {
    switchToLight: '切换至亮色',
    switchToDark: '切换至暗色',
  },
  image: {
    lost: '图片走丢了',
    retry: '请检查地址或网络后重试',
  },
  imageViewer: {
    zoomOut: '缩小',
    zoomIn: '放大',
    rotateLeft: '左旋 90°',
    rotateRight: '右旋 90°',
    reset: '复位',
    prev: '上一张',
    next: '下一张',
  },
  rate: {
    starAria: (n) => `${n} 星`,
  },
  qrcode: {
    aria: (value) => `二维码：${value}`,
  },
  otp: {
    slotAria: (i) => `第 ${i} 位`,
  },
  slideGo: {
    text: '滑动部署',
    done: '部署完成',
    aria: '滑动到最右侧完成',
  },
  swipeDeck: {
    go: '部署',
    back: '回滚',
    ok: '健康',
  },
  sortList: {
    handle: '拖我',
  },
  tree: {
    expandAria: (label) => `展开 ${label}`,
    checkAria: (label) => `勾选 ${label}`,
  },
  input: {
    clearAria: '清空',
  },
  inputNumber: {
    minusAria: '减少',
    plusAria: '增加',
  },
  inputTag: {
    placeholder: '输入后回车',
    removeAria: (tag) => `移除 ${tag}`,
  },
  autocomplete: {
    placeholder: '输入以搜索',
  },
  mention: {
    placeholder: '输入 @ 提及成员…',
  },
  treeSelect: {
    placeholder: '请选择',
  },
  alert: {
    closeAria: '关闭',
  },
  announce: {
    closeAria: '关闭通知',
  },
  anchor: {
    navAria: '页内导航',
  },
  backTop: {
    aria: '返回顶部',
  },
  breadcrumb: {
    navAria: '面包屑',
  },
  notification: {
    closeAria: '关闭',
  },
  pageHeader: {
    backAria: '返回',
  },
  parallaxBox: {
    hint: '移动鼠标 → 视差跟随 · 点击图形 → 旋转',
  },
  bottomSheet: {
    bgTitle: '部署详情',
    bgHint: '向上拖动底部把手展开',
  },
  actionButtons: {
    reject: '回滚',
    accept: '部署',
  },
  demo: {
    'actionButtons.reject': '已回滚',
    'actionButtons.accept': '部署完成',
    'affix.hint': '向下滚动主区，按钮将吸附在顶部菜单下缘 8px 处；展开/收起顶部通知横幅时吸附位自适应跟随，滚回顶部自动解除。',
    'affix.stickyBtn': '吸附中的按钮',
    'affix.placeholder': '滚动占位区（900px 高容器）',
    'alert.infoTitle': '提示',
    'alert.infoBody': '这是一条信息公告。',
    'alert.successTitle': '成功',
    'alert.successBody': '构建完成，无错误无警告。',
    'alert.warnTitle': '注意',
    'alert.warnBody': 'Node 20 以上版本为佳。',
    'alert.errorTitle': '出错了',
    'alert.errorBody': '依赖缺失，请重装 node_modules。',
    'anchor.sec1': '第一节',
    'anchor.sec2': '第二节',
    'anchor.sec3': '第三节',
    'anchor.note1': '锚点竖线随此容器滚动高亮切换：每一节标题滚过容器顶部判定线（offset=8px）时，右侧竖线即落到该节。滚动此容器观察。',
    'anchor.note2': '继续滚动，判定线跟随容器基准换算，不再把视口坐标误当容器内偏移。',
    'anchor.note3': '滚到底部：末节较短时顶边可能仍在判定线上方，组件会强制把竖线落到末节；直接点「第三节」跳转后同样即时高亮。',
    'announce.title': 'AeroUI Release v1.0.0「平流层」正式发布🎉',
    'announce.longBody': '一个好看、优雅、易套用的 Vue 组件库',
    'announce.shortBody': '一个好看、优雅、易套用的 Vue 组件库',
    'announce.action': '查看发布说明',
    'announce.marqueeLabel': '跑马灯自适应',
    'marquee.disclaimer': '所有产品名称、Logo 与品牌均属于其各自所有者。',
    'announce.longTextLabel': '长文案（演示溢出）',
    'announce.closeBtn': '关闭横幅',
    'announce.reopenBtn': '重新显示横幅',
    'announce.note': '关闭走 max-height 收起过渡，下方内容平滑上移不瞬跳；关闭为会话级，刷新后横幅重新出现。开启「长文案」且视口装不下时自动触发跑马灯；关闭「跑马灯自适应」则溢出直接截断。',
    'announce.bodyTitle': '模拟页面主体（用于观察收起时不跳变）',
    'announce.bodyText': '这是通知横幅下方的正文区域。关闭横幅时，本区域随 max-height 过渡平滑上移，无瞬间跳动。',
    'autocomplete.placeholder': '试试输入 v…',
    'avatar.pallet': '六色配板：',
    'avatar.multiSize': '多尺寸（28-128px）：',
    'backTop.hint': '向下滚动页面，右下角将出现返回顶部按钮。',
    'badge.customLabel': '自定义文本：',
    'badge.defaultText': '自定义文本',
    'badge.dotLabel': 'dot 前置圆点：',
    'badge.buildPass': '构建通过',
    'badge.degraded': '降级运行',
    'badge.deployFail': '部署失败',
    'badge.comboLabel': '场景组合（hover 有签名旋转）：',
    'bottomSheet.title': '构建 a4f29c1',
    'bottomSheet.duration': '耗时',
    'bottomSheet.cacheHit': '缓存命中',
    'bottomSheet.artifact': '产物大小',
    'bottomSheet.expanded': '抽屉已展开',
    'breadcrumb.home': '首页',
    'breadcrumb.components': '组件',
    'button.primary': '主要操作',
    'button.secondary': '次要操作',
    'button.ghost': '幽灵按钮',
    'button.danger': '危险操作',
    'button.dark': '深色按钮',
    'button.clickLoad': '点击加载',
    'button.disabled': '禁用',
    'button.withIcon': '带图标',
    'buttonGroup.day': '日',
    'buttonGroup.week': '周',
    'buttonGroup.month': '月',
    'buttonGroup.add': '新增',
    'buttonGroup.edit': '编辑',
    'card.hoverableTitle': '可悬停卡片',
    'card.hoverableBody': 'hover 时上浮旋转并投出 7px 硬阴影 —— Aero 签名交互。',
    'card.withHeaderTitle': '带页头',
    'card.body': '卡片正文内容。',
    'card.confirm': '确定',
    'card.cancel': '取消',
    'carousel.zh1': '硬阴影 × 弹性动效组件库',
    'carousel.zh2': '一 token 换整套主题',
    'carousel.zh3': '对标主流库的覆盖面',
    'carousel.customSlide': '自定义幻灯',
    'carousel.anyContent': '这里可以放任意 Vue 模板 / HTML：按钮、图表、表单……',
    'carousel.clickPlus': '点击 +1（当前',
    'carousel.clickPlusEnd': '）',
    'cascader.placeholder': '选择文件路径（三级）',
    'cascader.empty': '尚未选择',
    'checkbox.single': '单个复选',
    'checkbox.selected': '已选：',
    'checkbox.none': '无',
    'chip.removed': '已移除「',
    'chip.removedEnd': '」',
    'chip.selectedChip': '选中的 Chip',
    'chip.uncloseable': '不可关闭',
    'chip.reset': '重置',
    'collapse.q1': '什么是硬阴影签名交互？',
    'collapse.a1': 'hover 时元素位移 + 微旋转 + 偏移量实色阴影，构成 Aero 的可识别交互语言。',
    'collapse.q2': '圆角阶如何定义？',
    'collapse.a2': '控件 12px、卡片 18px、胶囊 99px，其余按 xs→2xl 阶梯。',
    'collapse.q3': '弹性曲线用什么？',
    'collapse.a3': 'cubic-bezier(.3,1.4,.4,1) —— 回弹感 spring。',
    'colorPicker.current': '当前色：',
    'configProvider.badge': '注入范围内渲染的组件',
    'configProvider.default': '默认（无 Provider 包裹）',
    'configProvider.injected': 'Provider 注入（theme=dark · preset=violet）',
    'descriptions.title': '包信息',
    'descriptions.pkgName': '包名',
    'descriptions.version': '版本',
    'descriptions.license': '协议',
    'descriptions.author': '作者',
    'descriptions.build': '构建',
    'descriptions.style': '样式',
    'dialog.openBtn': '打开对话框',
    'dialog.title': '确认删除',
    'dialog.body': '此操作将永久移除该组件的引用，是否继续？',
    'dialog.cancel': '取消',
    'dialog.delete': '删除',
    'divider.topContent': '上段内容',
    'divider.left': '左侧',
    'divider.middle': '中间',
    'divider.right': '右侧',
    'dotField.title': '点阵背景（开启流光后为极光扫光，缓慢漂移）',
    'dotField.flow': '流光',
    'drawer.openBtn': '打开抽屉',
    'drawer.title': '项目设置',
    'drawer.tag1': '标签一',
    'drawer.tag2': '标签二',
    'drawer.body': '抽屉从右侧滑入，Esc 可关闭。',
    'dropdown.copy': '复制链接',
    'dropdown.edit': '编辑',
    'dropdown.editDesc': '打开编辑器',
    'dropdown.share': '分享',
    'dropdown.delete': '删除',
    'dropdown.selected': '选中：',
    'dropdown.moreBtn': '更多操作 ▾',
    'form.required': '此项为必填',
    'form.submit': '提交：',
    'form.projectLabel': '项目名称',
    'form.charHint': '2-30 个字符',
    'form.namePlaceholder': '输入名称',
    'form.descLabel': '描述',
    'form.descPlaceholder': '可选',
    'form.submitBtn': '提交',
    'formItem.nameLabel': '名称',
    'formItem.requiredHint': '必填项',
    'formItem.namePlaceholder': '输入名称',
    'formItem.noteLabel': '备注',
    'formItem.noteError': '不能为空',
    'formItem.notePlaceholder': '选填',
    'grid.card': '卡片',
    'grid.sample': '网格列示例',
    'iconButton.notify': '通知',
    'iconButton.theme': '切换主题',
    'iconButton.search': '搜索',
    'iconButton.menu': '菜单',
    'iconButton.settings': '设置',
    'icon.searchPlaceholder': '搜索图标名…',
    'icon.clickCopy': '点击复制：',
    'icon.copied': '已复制',
    'image.sampleAlt': '示例图',
    'image.failAlt': '失败示例',
    'imageViewer.openBtn': '打开图片查看器',
    'input.required': '必填字段',
    'input.basicPlaceholder': '基础输入',
    'input.prefixPlaceholder': '带前缀',
    'input.errorPlaceholder': '错误态',
    'input.disabledPlaceholder': '禁用',
    'input.disabledValue': '不可编辑',
    'inputTag.placeholder': '输入标签后回车',
    'inputTag.current': '当前：',
    'iridescent.desc': '虹彩丝线（环境氛围背景：6–8 条低透明曲线，brand 色相派生，两层光晕，32s 缓慢循环）',
    'iridescent.hueDrift': '色相漂移',
    'knob.currentQuota': '当前配额',
    'knob.estimatedCost': '预估成本',
    'knob.perHour': '/ 时',
    'knob.vcpu': 'vCPU',
    'layout.blockTitle': '区块标题',
    'layout.body': 'Section 布局：96px 上下留白（compact 56px），alt 浅底，容器 1180px 居中。',
    'link.internal': '内部链接',
    'link.external': '外部链接',
    'link.disabled': '禁用链接',
    'loading.tip': '加载中…',
    'loading.wrapped': '被包裹内容',
    'loading.wrappedBody': '开启 loading 时出现覆盖层与 spinner。',
    'loading.toggle': '切换 Loading',
    'mention.aeroTeam': 'Aero 团队',
    'menu.home': '首页',
    'menu.components': '组件',
    'menu.docs': '文档',
    'menu.groupOverview': '概览',
    'menu.dashboard': '仪表盘',
    'menu.monitor': '实时监控',
    'menu.groupComponents': '组件',
    'menu.form': '表单',
    'menu.data': '数据',
    'menu.groupSettings': '设置',
    'menu.account': '账号',
    'menu.collapse': '折叠',
    'menu.expand': '展开',
    'menu.collapseHint': 'collapsed 状态 · 折叠态 hover 浮出菜单名',
    'messageBox.title': '删除组件',
    'messageBox.message': '将永久移除 AeroDemo 的引用，此操作不可撤销。',
    'messageBox.confirmText': '删除',
    'messageBox.deleted': '已删除',
    'messageBox.cancelled': '已取消',
    'messageBox.triggerBtn': '触发确认框',
    'mobileCarousel.zh1': '平流层版本正式上线',
    'mobileCarousel.chip1': '查看更新 →',
    'mobileCarousel.zh2': '全球边缘节点，就近接入',
    'mobileCarousel.chip2': '节点地图 →',
    'mobileCarousel.zh3': '从 git push 到全球可访问',
    'mobileCarousel.chip3': '部署文档 →',
    'mobileStatCard.p95': 'P95 延迟',
    'mobileStatCard.online': '在线实例',
    'mobileStatCard.deploy': '本月部署',
    'mobileTabBar.home': '首页',
    'mobileTabBar.deploy': '部署',
    'mobileTabBar.monitor': '监控',
    'mobileTabBar.my': '我的',
    'motionPresets.enableLabel': '启用动画（全局）',
    'notification.success': '成功',
    'notification.successTitle': '部署完成',
    'notification.successBody': '预览链接已生成',
    'notification.error': '错误',
    'notification.errorTitle': '部署失败',
    'notification.errorBody': '请查看构建日志',
    'notification.warn': '警告',
    'notification.warnTitle': '配额告警',
    'notification.warnBody': '本月构建配额剩余 12%',
    'notification.info': '信息',
    'notification.infoTitle': '新版本 0.2.0',
    'notification.infoBody': '含 22 项修复',
    'otp.codeLabel': '验证码：',
    'pageHeader.title': '组件总览',
    'pageHeader.subtitle': 'Aero UI 提供的 75+ 组件按六大类组织，均可按需引入。',
    'pageHeader.exportBtn': '导出',
    'pagination.pageOf': '第',
    'pagination.pageSuffix': '页',
    'partyFx.btn': '🎉 点这里放礼花',
    'partyFx.note': '礼花为事件驱动、有限时长；prefers-reduced-motion 下自动静默。',
    'phone.title': '概览',
    'phone.subtitle': '下午好，顾青空 · 一切运行正常',
    'phone.allOk': '一切运行正常',
    'phone.p95': 'P95 延迟',
    'phone.online': '在线实例',
    'phone.deploy': '本月部署',
    'phone.home': '首页',
    'phone.deployTab': '部署',
    'phone.monitorTab': '监控',
    'phone.myTab': '我的',
    'popconfirm.publishTitle': '发布 0.2.0 到 npm？',
    'popconfirm.publishBtn': '发布',
    'popconfirm.published': '已发布',
    'popconfirm.deleteTitle': '此操作不可撤销，确认删除？',
    'popconfirm.deleteBtn': '删除',
    'popconfirm.deleted': '已删除',
    'popover.hoverTitle': '悬停 Popover',
    'popover.hoverBtn': '悬停触发',
    'popover.hoverBody': '浮层内容：跟随滚动重定位，支持上下右三方位。',
    'popover.clickTitle': '点击 Popover',
    'popover.clickBtn': '点击触发',
    'popover.clickBody': '右侧弹出的浮层内容。',
    'pullToRefresh.item1': 'web-portal 部署成功',
    'pullToRefresh.item1Desc': '华东-1 · 11.6s',
    'pullToRefresh.item2': 'PR #482 已合并',
    'pullToRefresh.item2Desc': 'feat: 边缘节点健康检查',
    'pullToRefresh.item3': '自动扩容至 18 实例',
    'pullToRefresh.item3Desc': 'metric: qps · 阈值触发',
    'pullToRefresh.item4': 'billing-svc 已回滚',
    'pullToRefresh.item5': '密钥已自动轮转',
    'pullToRefresh.item5Desc': 'db-password · 无感热更',
    'pullToRefresh.done': '刷新完成',
    'qrcode.caption': '输入内容即时重新生成二维码；主题切换时 QR 前景色自动跟随 --ui-ink 重绘',
    'qrcode.contentLabel': '内容',
    'qrcode.inputPlaceholder': '任意文本 / URL',
    'qrcode.sizeLabel': '尺寸',
    'qrcode.fgLabel': '前景色（留空 = 取 --ui-ink 计算值）',
    'qrcode.meta': '当前输入',
    'qrcode.chars': '字符（版本 1-10 自动适配）',
    'radioGroup.optA': '选项 A',
    'radioGroup.optB': '选项 B',
    'radioGroup.optC': '选项 C',
    'rate.current': '当前评分：',
    'rate.decimalToggle': '一位小数',
    'rate.allowReselect': '允许重选',
    'rate.decimalHint': '关闭为整数评级；开启后按 0.1 粒度点击星内位置评分',
    'result.paySuccess': '支付完成',
    'result.paySuccessDesc': '订单将在 2 个工作日内发出。',
    'result.viewOrder': '查看订单',
    'result.payFail': '支付失败',
    'result.payFailDesc': '网络异常，请重试或联系客服。',
    'result.retry': '重试',
    'scrollbar.item': '列表条目',
    'scrollbar.itemNote': '—— 滚动条 hover 会变品牌色',
    'search.placeholder': '模糊搜索组件…',
    'search.selected': '已选：',
    'search.none': '—',
    'search.hint': '输入以筛选，空输入显示全部',
    'search.optButton': 'Button 按钮',
    'search.optForm': 'Form 表单',
    'search.optTable': 'Table 表格',
    'search.optTree': 'Tree 树选择',
    'search.optAvatar': 'Avatar 头像',
    'search.optImageViewer': 'ImageViewer 图片查看器',
    'search.optCarousel': 'Carousel 轮播',
    'search.optAffix': 'Affix 固钉',
    'search.optAnchor': 'Anchor 锚点',
    'search.optCollapse': 'Collapse 折叠面板',
    'search.optButtonDesc': '触发操作的按钮，支持类型、尺寸与加载状态',
    'search.optFormDesc': '数据录入表单，内置校验与多种布局',
    'search.optTableDesc': '数据表格，支持排序、选择与固定列',
    'search.optTreeDesc': '树形结构选择器，展示层级数据',
    'search.optAvatarDesc': '用户头像，支持图片与文字回退',
    'search.optImageViewerDesc': '全屏图片预览，支持缩放与旋转',
    'search.optCarouselDesc': '循环轮播，展示多段内容',
    'search.optAffixDesc': '滚动时将元素固定在视口指定位置',
    'search.optAnchorDesc': '页面内锚点导航',
    'search.optCollapseDesc': '可展开收起的折叠面板',
    'search.optGroupForm': '表单',
    'search.optGroupDataDisplay': '数据展示',
    'search.optGroupNavigation': '导航',
    'segmented.listDesc': '列表视图：逐行排列，适合扫描与对比',
    'segmented.gridDesc': '网格视图：平铺展示，适合缩略浏览',
    'segmented.kanbanDesc': '看板视图：按列分组，适合流程跟踪',
    'segmented.monthly': '月付',
    'segmented.yearly': '年付',
    'segmented.billing': '计费：',
    'segmented.viewLabel': '视图：',
    'segmented.list': '列表',
    'segmented.grid': '网格',
    'segmented.kanban': '看板',
    'select.placeholder': '选择框架',
    'select.current': '当前值：',
    'select.none': '无',
    'skeleton.name': '顾青空 · 发布了 v3.0',
    'skeleton.time': '2 分钟前 · 华东-1',
    'skeleton.title': '平流层版本正式上线',
    'skeleton.p1': '新版本把构建、调度、扩缩与可观测折叠进一条命令。',
    'skeleton.p2': '从 git push 到全球可访问，现在只需 11.6 秒。',
    'skeleton.p3': '所有边缘节点已自动完成健康检查与热更新。',
    'skeleton.viewUpdate': '查看更新',
    'skeleton.deployDoc': '部署文档',
    'skeleton.toggle': '切换加载态（骨架 ⇄ 内容）',
    'slideGo.done': '滑动部署完成：my-app 已上线',
    'slideGo.title': '滑动解锁',
    'sortList.meta12': '12 副本',
    'sortList.meta18': '18 副本',
    'sortList.meta4': '4 副本',
    'sortList.meta2': '2 副本',
    'sortList.updated': '列表顺序已更新',
    'sortList.dragTitle': '拖动排序',
    'space.clickPrimary': '可点击 Primary',
    'space.clickOutline': '可点击 Outline',
    'space.clickGhost': '可点击 Ghost',
    'space.to32': '切换到 32px',
    'space.to12': '切换回 12px',
    'space.leftEnd': '左端（justify=between）',
    'space.rightEnd': '右端',
    'space.vertA': '垂直 A',
    'space.vertB': '垂直 B',
    'space.lastClick': '最近点击：',
    'statistic.availability': '可用性',
    'statistic.componentCount': '组件数',
    'steps.create': '创建工程',
    'steps.install': '安装依赖',
    'steps.build': '构建',
    'steps.publish': '发布',
    'steps.prev': '上一步',
    'steps.next': '下一步',
    'steps.current': '当前步骤：',
    'swipeDeck.healthy': '健康',
    'swipeDeck.degraded': '降级',
    'swipeDeck.abnormal': '异常',
    'swipeDeck.regionEast': '华东-1',
    'swipeDeck.regionNorth': '华北-1',
    'swipeDeck.staging': '预发',
    'swipeDeck.regionSouth': '华南-2',
    'swipeDeck.build': '构建',
    'swipeDeck.loopLabel': '循环补位（关=划掉销毁）',
    'swipeDeck.deckCount': '牌组',
    'swipeDeck.deckCountUnit': '张',
    'swipeDeck.deploy': '部署',
    'swipeDeck.rollback': '回滚',
    'swipeDeck.empty': '牌组已清空',
    'swipeDeck.insertBtn': '插入新卡（FLIP 入场）',
    'swipeDeck.removeBtn': '移除顶卡',
    'switch.followSystem': '跟随系统主题',
    'switch.inverted': '反向开关',
    'switch.disabled': '禁用态',
    'table.vueDesc': 'Vue 3 组件库',
    'table.buildTool': '构建工具',
    'table.preprocessor': '样式预处理器',
    'tabs.basic': '基础',
    'tabs.style': '样式',
    'tabs.motion': '动效',
    'tabs.basicPanel': '基础面板内容',
    'tabs.stylePanel': '样式面板内容',
    'tabs.motionPanel': '动效面板内容',
    'textarea.multiLine': '多行文本，可垂直缩放',
    'textarea.withCount': '带计数',
    'themeProvider.aeroBlue': 'Aero 蓝',
    'themeProvider.hint': '选择预设 — 整站品牌色即时切换；切换其他页面或刷新后保持所选主题色',
    'themeProvider.brandChanged': '品牌色已切换',
    'themeProvider.scopedBadge': '作用域预览 · 全局零改动',
    'themeProvider.scopedHint': '预设按钮只影响下方预览框（CSS 变量仅写容器，不动 :root）；点「应用到全局」才写全局主题并持久化',
    'themeProvider.globalLabel': '当前全局预设',
    'themeProvider.applyBtn': '应用到全局',
    'themeSwitch.hint': '点击切换明暗主题（持久化）',
    'themeSwitch.hintControlled': '受控模式：状态由外部管理，绑定值实时驱动主题',
    'themeSwitch.secBasic': '基础（现行为）',
    'themeSwitch.secControlled': '受控 v-model（实时显示绑定值）',
    'themeSwitch.secSizes': '尺寸 sm · md · lg',
    'themeSwitch.secDisabled': '禁用（由真实开关控制示例开关）',
    'themeSwitch.secChangeLog': 'change 事件日志',
    'themeSwitch.logEmpty': '（尚无事件——点上方开关试试）',
    'themeSwitch.logLight': 'change → light',
    'themeSwitch.logDark': 'change → dark',
    'timeline.item1': '工程骨架搭建',
    'timeline.item1Desc': 'tokens 体系与 composables 落成',
    'timeline.item2': '组件转化开发',
    'timeline.item2Desc': '40+ demo 组件还原为 SFC',
    'timeline.item3': '演示页上线',
    'timeline.item3Desc': 'Playground 与文档同步发布',
    'toast.success': '成功',
    'toast.successMsg': '构建完成，0 错误 0 警告',
    'toast.error': '错误',
    'toast.errorMsg': '依赖缺失，请重新安装',
    'toast.warn': '警告',
    'toast.warnMsg': 'Node 20+ 为佳',
    'toast.info': '信息',
    'toast.infoMsg': '新版本 0.2.0 已发布',
    'tooltip.top': '从顶部弹出的提示',
    'tooltip.topBtn': '上方提示',
    'tooltip.bottom': '从底部弹出的提示',
    'tooltip.bottomBtn': '底部提示',
    'tour.step1Title': '第一步：搜索',
    'tour.step1Desc': '在这里输入关键词过滤组件。',
    'tour.step2Title': '第二步：状态',
    'tour.step2Desc': '徽章显示当前构建状态。',
    'tour.step3Title': '第三步：开始',
    'tour.step3Desc': '点击开始你的 Aero 之旅。',
    'tour.searchPlaceholder': '搜索组件',
    'tour.badge': '构建通过',
    'tour.startBtn': '开始导览',
    'tree.checked': '勾选（',
    'tree.checkedEnd': '）：',
    'tree.hint': '勾选父节点联动全选后代；部分勾选显示半选态',
    'tree.includeParents': '包含父节点',
    'treeSelect.groupBasic': '基础组件',
    'treeSelect.groupForm': '表单组件',
    'treeSelect.groupData': '数据展示组件',
    'treeSelect.groupFeedback': '反馈组件',
    'treeSelect.optButton': 'Button 按钮',
    'treeSelect.optIcon': 'Icon 图标',
    'treeSelect.optTypography': 'Typography 排版',
    'treeSelect.optDivider': 'Divider 分割线',
    'treeSelect.optInput': 'Input 输入框',
    'treeSelect.optSelect': 'Select 选择器',
    'treeSelect.optDatepicker': 'DatePicker 日期选择',
    'treeSelect.optUpload': 'Upload 上传',
    'treeSelect.optTable': 'Table 表格',
    'treeSelect.optTimeline': 'Timeline 时间线',
    'treeSelect.optStatistic': 'Statistic 统计数值',
    'treeSelect.optToast': 'Toast 轻提示',
    'treeSelect.optDialog': 'Dialog 对话框',
    'treeSelect.placeholder': '选择组件',
    'treeSelect.current': '当前 key:',
    'treeSelect.none': '—',
    'typography.display': '云原生，本该如此简单',
    'typography.title': '声明式配置，天然贴合 GitOps',
    'typography.body': 'AeroBase 把构建、调度、扩缩与可观测折叠进一条命令，让小团队也拥有大厂级的交付基础设施。行高 1.75，段距 14px，保证长文阅读的舒适度。',
    'typography.link': '文字链接',
    'typography.bold': '加粗文本',
    'typography.highlight': '高亮词',
    'typography.cloudWord': '云端',
    'typography.boltWord': '闪电',
    'typography.stickerPre': '贴纸样式',
    'typography.stickerPost': '高亮',
    'typography.replay': '重播动画',
    'typography.trigger': '触发',
    'typography.sendTo': '把应用送上',
    'typography.like': '快得像',
    'typography.sameAs': '一样',
    'watermark.title': '带水印的内容区',
    'watermark.body': '水印平铺于背景，不阻挡交互。',
  },
}

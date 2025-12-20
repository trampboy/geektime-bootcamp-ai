// Project Alpha - 常量定义

/**
 * Ticket 状态选项
 */
export const TICKET_STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '进行中' },
  { value: 'completed', label: '已完成' },
] as const;

/**
 * 默认标签颜色列表
 */
export const TAG_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F59E0B', // Yellow
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
] as const;

/**
 * 搜索防抖延迟（毫秒）
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

const priceFormatter = new Intl.NumberFormat('vi-VN');

export function formatPrice(value) {
  return `${priceFormatter.format(Number(value))} ₫`;
}

export const statusLabel = {
  active: 'Đang bán',
  inactive: 'Ngừng bán',
};

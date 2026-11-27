export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categories = [],
}) {
  return (
    <div className="filters">
      <input
        type="search"
        data-testid="search-input"
        aria-label="Tìm kiếm theo tên hoặc SKU"
        placeholder="Tìm theo tên hoặc SKU"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        data-testid="category-filter"
        aria-label="Lọc theo danh mục"
        value={category}
        onChange={onCategoryChange}
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        data-testid="status-filter"
        aria-label="Lọc theo trạng thái"
        value={status}
        onChange={onStatusChange}
      >
        <option value="">Tất cả</option>
        <option value="active">Đang bán</option>
        <option value="inactive">Ngừng bán</option>
      </select>
    </div>
  );
}

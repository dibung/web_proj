const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;
const MAX_SIZE = 100;

exports.parsePagination = (query) => {
  let page = parseInt(query.page, 10);
  let size = parseInt(query.size, 10);

  if (isNaN(page) || page < 0) page = DEFAULT_PAGE;
  if (isNaN(size) || size <= 0) size = DEFAULT_SIZE;
  if (size > MAX_SIZE) size = MAX_SIZE;

  // sort=field,DESC 형태 처리
  let sortField = 'created_at';
  let sortDir = 'DESC';

  if (query.sort) {
    const [field, dir] = query.sort.split(',');
    if (field) sortField = field;
    if (dir && ['ASC', 'DESC'].includes(dir.toUpperCase())) {
      sortDir = dir.toUpperCase();
    }
  }

  return {
    page,
    size,
    sortField,
    sortDir,
  };
};

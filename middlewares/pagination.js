exports.parsePagination = (query) => {
  const page = Math.max(parseInt(query.page) || 0, 0);
  const size = Math.min(parseInt(query.size) || 20, 50);

  const [sortField = 'created_at', sortDir = 'DESC'] =
    (query.sort || 'created_at,DESC').split(',');

  return { page, size, sortField, sortDir };
};

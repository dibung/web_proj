const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // 🔴 추가 비즈니스 검증 (Joi가 못 잡는 경우)
    if (title.length > 100) {
      return next(
        new ApiError(ERROR.VALIDATION_FAILED, {
          title: `현재 길이 ${title.length}자`
        })
      );
    }

    // 정상 처리
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

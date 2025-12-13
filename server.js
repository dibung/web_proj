// 📦 필요한 모듈
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// 📦 앱 초기화
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 📦 MongoDB 연결
mongoose.connect('mongodb://localhost:27017/bookstore_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// =========================
// 🧱 Schema 정의
// =========================

// 👤 User
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  admin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});
userSchema.pre('save', async function(next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const User = mongoose.model('User', userSchema);

// 🧑‍🎨 Author
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});
const Author = mongoose.model('Author', authorSchema);

// 📂 Category
const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true, unique: true }
});
const Category = mongoose.model('Category', categorySchema);

// 📚 Book
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  publisher: { type: String, required: true },
  published_at: { type: Date, default: Date.now },
  cover_image_url: { type: String }
});
const Book = mongoose.model('Book', bookSchema);

// 🛒 Cart
const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const Cart = mongoose.model('Cart', cartSchema);

// 🛒 Cart Items
const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, default: 1, required: true }
});
const CartItem = mongoose.model('CartItem', cartItemSchema);

// 💸 Orders
const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ordered_at: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});
const Order = mongoose.model('Order', orderSchema);

// 💸 Order Items
const orderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, default: 1, required: true }
});
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

// 📝 Review
const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String },
  body: { type: String },
  like_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});
reviewSchema.index({ user_id: 1, book_id: 1 }, { unique: true });
const Review = mongoose.model('Review', reviewSchema);

// 💬 Comment
const commentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  review_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  body: { type: String, required: true },
  like_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});
const Comment = mongoose.model('Comment', commentSchema);

// ❤️ Favorite
const favoriteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  created_at: { type: Date, default: Date.now }
});
const Favorite = mongoose.model('Favorite', favoriteSchema);

// 🌟 ReviewLike (중복 방지)
const reviewLikeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  review_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true }
});
reviewLikeSchema.index({ user_id: 1, review_id: 1 }, { unique: true });
const ReviewLike = mongoose.model('ReviewLike', reviewLikeSchema);

// 🌟 CommentLike (중복 방지)
const commentLikeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }
});
commentLikeSchema.index({ user_id: 1, comment_id: 1 }, { unique: true });
const CommentLike = mongoose.model('CommentLike', commentLikeSchema);

// =========================
// 🌐 API
// =========================

// ✅ 회원가입
app.post('/api/users', async (req,res)=>{
  try{
    const { email, password, username, admin } = req.body;
    const exist = await User.findOne({ email });
    if(exist) return res.status(400).json({ error: '이미 존재하는 이메일' });
    const user = new User({ email, password, username, admin: admin || false });
    await user.save();
    res.status(201).json(user);
  }catch(err){
    res.status(400).json({ error: err.message });
  }
});

// ✅ 로그인
app.post('/api/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error: '사용자 없음' });
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ error: '비밀번호 틀림' });
    res.json({ user_id: user._id, admin: user.admin });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
});
// ✅ 사용자 삭제
app.delete('/api/users/:user_id', async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) return res.status(404).json({ error: '사용자 없음' });

    user.deleted_at = new Date();
    user.updated_at = new Date();
    await user.save();

    res.json({ message: '사용자 논리 삭제 완료', user_id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Author CRUD
app.post('/api/authors', async (req,res)=>{
  try{
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/authors', async (req,res)=>{
  const authors = await Author.find();
  res.json(authors);
});

// ✅ Category CRUD
app.post('/api/categories', async (req,res)=>{
  try{
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/categories', async (req,res)=>{
  const categories = await Category.find();
  res.json(categories);
});

// ✅ Book CRUD
app.post('/api/books', async (req,res)=>{
  try{
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/books', async (req,res)=>{
  const books = await Book.find().populate('author_id').populate('category_id');
  res.json(books);
});

// ✅ 책 정보 수정 (PATCH)
app.patch('/api/books/:book_id', async (req, res) => {
  try {
    const { book_id } = req.params;
    const updateData = req.body; // { price: 5000 } 등
    const book = await Book.findByIdAndUpdate(book_id, updateData, { new: true });
    if (!book) return res.status(404).json({ error: '책 없음' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Cart
app.post('/api/carts', async (req,res)=>{
  try{
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
    const exist = await Cart.findOne({ user_id });
    if(exist) return res.status(400).json({ error: '장바구니 이미 존재' });
    const cart = new Cart({ user_id });
    await cart.save();
    res.status(201).json(cart);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/carts', async (req,res)=>{
  const { user_id } = req.query;
  if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
  const cart = await Cart.findOne({ user_id });
  res.json(cart);
});

// ✅ Cart Items
app.post('/api/cart-items',  async (req,res)=>{
  try{
    const { cart_id, book_id, quantity } = req.body;
    const item = new CartItem({ cart_id, book_id, quantity });
    await item.save();
    res.status(201).json(item);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/cart-items/:cart_id',  async (req,res)=>{
  const items = await CartItem.find({ cart_id: req.params.cart_id }).populate('book_id');
  res.json(items);
});

// ✅ Orders
app.post('/api/orders',  async (req,res)=>{
  try{
    const { user_id, items } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
    const order = new Order({ user_id });
    await order.save();
    for(const i of items){
      const orderItem = new OrderItem({ order_id: order._id, book_id: i.book_id, quantity: i.quantity });
      await orderItem.save();
    }
    res.status(201).json(order);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/orders',  async (req,res)=>{
  const { user_id } = req.query;
  if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
  const orders = await Order.find({ user_id });
  res.json(orders);
});

// ✅ Review
app.post('/api/reviews', async (req,res)=>{
  try{
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
    const review = new Review({ ...req.body, user_id });
    await review.save();
    res.status(201).json(review);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/reviews/:book_id', async (req,res)=>{
  const reviews = await Review.find({ book_id: req.params.book_id });
  res.json(reviews);
});

// ✅ Comment
app.post('/api/comments', async (req,res)=>{
  try{
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
    const comment = new Comment({ ...req.body, user_id });
    await comment.save();
    res.status(201).json(comment);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/comments/:review_id', async (req,res)=>{
  const comments = await Comment.find({ review_id: req.params.review_id });
  res.json(comments);
});

// ✅ Favorite
app.post('/api/favorites', async (req,res)=>{
  try{
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
    const fav = new Favorite({ ...req.body, user_id });
    await fav.save();
    res.status(201).json(fav);
  }catch(err){ res.status(400).json({ error: err.message }); }
});
app.get('/api/favorites', async (req,res)=>{
  const { user_id } = req.query;
  if(!user_id) return res.status(400).json({ error: 'user_id 필요' });
  const favs = await Favorite.find({ user_id }).populate('book_id');
  res.json(favs);
});

// =========================
// 🌟 리뷰 좋아요 / 취소
// =========================
app.post('/api/reviews/:review_id/like', async (req, res) => {
  try {
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });

    const review = await Review.findById(req.params.review_id);
    if(!review) return res.status(404).json({ error: '리뷰 없음' });

    const exist = await ReviewLike.findOne({ user_id, review_id: review._id });
    if(exist) return res.status(400).json({ error: '이미 좋아요한 리뷰' });

    const like = new ReviewLike({ user_id, review_id: review._id });
    await like.save();

    review.like_count += 1;
    await review.save();

    res.json({ review_id: review._id, like_count: review.like_count });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/reviews/:review_id/unlike', async (req,res)=>{
  try{
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });

    const review = await Review.findById(req.params.review_id);
    if(!review) return res.status(404).json({ error: '리뷰 없음' });

    const like = await ReviewLike.findOne({ user_id, review_id: review._id });
    if(!like) return res.status(400).json({ error: '좋아요하지 않은 리뷰' });

    await like.remove();
    review.like_count = Math.max(review.like_count -1, 0);
    await review.save();

    res.json({ review_id: review._id, like_count: review.like_count });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

// =========================
// 🌟 댓글 좋아요 / 취소
// =========================
app.post('/api/comments/:comment_id/like', async (req,res)=>{
  try{
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });

    const comment = await Comment.findById(req.params.comment_id);
    if(!comment) return res.status(404).json({ error: '댓글 없음' });

    const exist = await CommentLike.findOne({ user_id, comment_id: comment._id });
    if(exist) return res.status(400).json({ error: '이미 좋아요한 댓글' });

    const like = new CommentLike({ user_id, comment_id: comment._id });
    await like.save();

    comment.like_count += 1;
    await comment.save();

    res.json({ comment_id: comment._id, like_count: comment.like_count });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

app.post('/api/comments/:comment_id/unlike', async (req,res)=>{
  try{
    const { user_id } = req.body;
    if(!user_id) return res.status(400).json({ error: 'user_id 필요' });

    const comment = await Comment.findById(req.params.comment_id);
    if(!comment) return res.status(404).json({ error: '댓글 없음' });

    const like = await CommentLike.findOne({ user_id, comment_id: comment._id });
    if(!like) return res.status(400).json({ error: '좋아요하지 않은 댓글' });

    await like.remove();
    comment.like_count = Math.max(comment.like_count-1,0);
    await comment.save();

    res.json({ comment_id: comment._id, like_count: comment.like_count });
  }catch(err){ res.status(500).json({ error: err.message }); }
});


// =========================
// 🔐 Auth
// =========================
app.post('/api/auth/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ error: '사용자 없음' });

  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(400).json({ error: '비밀번호 틀림' });

  res.json({ user_id: user._id, admin: user.admin });
});

app.post('/api/auth/logout', (req,res)=>{
  res.json({ message: '로그아웃 완료' });
});

// =========================
// 👤 Users 확장
// =========================
app.get('/api/users', async (req,res)=>{
  const users = await User.find().select('-password');
  res.json(users);
});

app.patch('/api/users/:user_id/deactivate', async (req,res)=>{
  const user = await User.findById(req.params.user_id);
  if(!user) return res.status(404).json({ error: '사용자 없음' });

  user.deleted_at = new Date();
  await user.save();

  res.json({ message: '계정 비활성화 완료' });
});

app.get('/api/users/:user_id/orders', async (req,res)=>{
  const orders = await Order.find({ user_id: req.params.user_id });
  res.json(orders);
});

// =========================
// 🧑‍🎨 Authors
// =========================
app.get('/api/authors', async (req,res)=>{
  const authors = await Author.find();
  res.json(authors);
});

app.get('/api/authors/:author_id/books', async (req,res)=>{
  const books = await Book.find({ author_id: req.params.author_id });
  res.json(books);
});

// =========================
// 📂 Categories
// =========================
app.get('/api/categories', async (req,res)=>{
  const categories = await Category.find();
  res.json(categories);
});

app.get('/api/categories/:category_id/books', async (req,res)=>{
  const books = await Book.find({ category_id: req.params.category_id });
  res.json(books);
});

// =========================
// 📝 Review 좋아요
// =========================
app.post('/api/reviews/:review_id/like', async (req,res)=>{
  const review = await Review.findById(req.params.review_id);
  if(!review) return res.status(404).json({ error: '리뷰 없음' });

  review.like_count += 1;
  await review.save();

  res.json({ like_count: review.like_count });
});

app.post('/api/reviews/:review_id/unlike', async (req,res)=>{
  const review = await Review.findById(req.params.review_id);
  if(!review) return res.status(404).json({ error: '리뷰 없음' });

  review.like_count = Math.max(review.like_count - 1, 0);
  await review.save();

  res.json({ like_count: review.like_count });
});

// =========================
// 💬 Comments
// =========================
app.post('/api/comments', async (req,res)=>{
  const comment = new Comment(req.body);
  await comment.save();
  res.status(201).json(comment);
});

app.get('/api/reviews/:review_id/comments', async (req,res)=>{
  const comments = await Comment.find({ review_id: req.params.review_id });
  res.json(comments);
});

// =========================
// 📊 Stats
// =========================
app.get('/api/stats/top-books', async (req,res)=>{
  const books = await Review.aggregate([
    { $group: { _id: "$book_id", reviews: { $sum: 1 } } },
    { $sort: { reviews: -1 } },
    { $limit: 5 }
  ]);
  res.json(books);
});



// =========================
// 🚀 서버 실행
// =========================
const PORT = 3000;
app.listen(PORT, ()=>console.log(`🚀 Server running on http://localhost:${PORT}`));
  
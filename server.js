const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем серверу читать JSON-данные и отдавать файлы из папки public
app.use(express.json());
app.use(express.static('public'));

// Наша "База данных" в оперативной памяти сервера
let users = {}; 
let posts = [];

// API: Регистрация
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) return res.status(400).json({ error: "Логин уже занят" });
    users[username] = password;
    res.json({ success: true });
});

// API: Вход
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] === password) return res.json({ success: true });
    res.status(401).json({ error: "Неверный логин или пароль" });
});

// API: Получить все посты
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// API: Создать пост
app.post('/api/posts', (req, res) => {
    const { author, content } = req.body;
    const newPost = { id: Date.now(), author, content, likes: [] };
    posts.unshift(newPost); // Добавляем в начало
    res.json(newPost);
});

// API: Поставить/убрать лайк
app.post('/api/posts/:id/like', (req, res) => {
    const postId = parseInt(req.params.id);
    const { username } = req.body;
    const post = posts.find(p => p.id === postId);
    
    if (!post) return res.status(404).json({ error: "Пост не найден" });

    const hasLiked = post.likes.includes(username);
    if (hasLiked) {
        post.likes = post.likes.filter(user => user !== username); // Убираем лайк
    } else {
        post.likes.push(username); // Ставим лайк
    }
    res.json(post);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
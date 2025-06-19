const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.json');

let data = {
    users: [],
    todos: [],
};

const loadData = () => {
    if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        data = JSON.parse(fileContent);
        console.log('Mengambil data dari data.json');
    } else {
        console.log('data.json tidak ditemukan, membuat file baru');
        saveData();
    }
};

const saveData = () => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        console.log('Data berhasil disimpan ke data.json');
    } catch (error) {
        console.error('Gagal Menyimpan data.json:', error.message);
    }
};

try {
    loadData();
} catch (error) {
    console.error('Error loading data:', error.message);
}

const generateId = (array) => {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

// Event CRUD
const addTodos = (todo) => {
    try {
        const currentTime = new Date().toISOString();
        const newTodo = { 
            id: generateId(data.todos), 
            ...todo, 
            status: todo.status || 'pending',
            createdAt: currentTime,
            updatedAt: currentTime
        };
        
        // Validasi required fields
        if (!newTodo.title) {
            throw new Error('Title is required');
        }
        if (!newTodo.userId) {
            throw new Error('UserId is required');
        }
        if (!newTodo.dueDate) {
            throw new Error('DueDate is required');
        }
        
        data.todos.push(newTodo);
        saveData();
        console.log(`Tugas Ditambahkan: ${newTodo.title}`);
        return newTodo;
    } catch (error) {
        console.error('Gagal Menambahkan Tugas:', error.message);
        throw error;
    }
};

const updatedTodos = (id, updatedTodo) => {
    try {
        const index = data.todos.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
            data.todos[index] = { 
                ...data.todos[index], 
                ...updatedTodo,
                updatedAt: new Date().toISOString()
            };
            saveData();
            console.log(`Tugas diupdated: ${id}`);
            return data.todos[index];
        } else {
            throw new Error('Todo not found');
        }
    } catch (error) {
        console.error('Gagal Updated Tugas:', error.message);
        throw error;
    }
};

const deleteTodos = (id) => {
    try {
        const initialLength = data.todos.length;
        data.todos = data.todos.filter(e => e.id !== parseInt(id));
        
        if (data.todos.length === initialLength) {
            throw new Error('Todo not found');
        }
        
        saveData();
        console.log(`Tugas dihapus: ${id}`);
        return true;
    } catch (error) {
        console.error('Gagal Menghapus Tugas:', error.message);
        throw error;
    }
};

const getTodos = (userId = null) => {
    if (userId) {
        return data.todos.filter(todo => todo.userId === parseInt(userId));
    }
    return data.todos;
};

const getTodoById = (id) => {
    return data.todos.find(todo => todo.id === parseInt(id));
};

// User CRUD
const addUser = async (user) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = { id: data.users.length + 1, ...user, password: hashedPassword };
        data.users.push(newUser);
        saveData();
        console.log(`User ditambahkan: ${newUser.email}`);
        return newUser;
    } catch (error) {
        console.error('Gagal Menambahkan user:', error.message);
    }
};

const updateUser = async (id, updatedUser) => {
    try {
        const index = data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            if (updatedUser.password) {
                updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
            }
            data.users[index] = { ...data.users[index], ...updatedUser };
            saveData();
            console.log(`User diupdated: ${id}`);
        }
    } catch (error) {
        console.error('Gagal updated user:', error.message);
    }
};

const deleteUser = (id) => {
    try {
        data.users = data.users.filter(u => u.id !== id);
        saveData();
        console.log(`User dihapus: ${id}`);
    } catch (error) {
        console.error('Gagal Hapus user:', error.message);
    }
};

const getUsers = () => data.users;

const findUserByEmail = (email) => data.users.find(u => u.email === email);

module.exports = {
    addTodos,
    updatedTodos,
    deleteTodos,
    getTodos,
    getTodoById,
    addUser,
    updateUser,
    deleteUser,
    getUsers,
    findUserByEmail,
};
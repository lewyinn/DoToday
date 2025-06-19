import { NextResponse } from 'next/server';
import { addTodos, getTodos } from '@/lib/data';

// GET /api/todos - Mendapatkan semua todos atau todos berdasarkan userId
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const todos = getTodos(userId ? parseInt(userId) : null);

        return NextResponse.json({
            success: true,
            message: 'Todos berhasil diambil',
            data: todos
        }, { status: 200 });

    } catch (error) {
        console.error('Error getting todos:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal mengambil todos',
            error: error.message
        }, { status: 500 });
    }
}

// POST /api/todos - Menambahkan todo baru
export async function POST(request) {
    try {
        const body = await request.json();

        // Validasi input
        if (!body.title) {
            return NextResponse.json({
                success: false,
                message: 'Title wajib diisi'
            }, { status: 400 });
        }

        if (!body.userId) {
            return NextResponse.json({
                success: false,
                message: 'UserId wajib diisi'
            }, { status: 400 });
        }

        if (!body.dueDate) {
            return NextResponse.json({
                success: false,
                message: 'Due date wajib diisi'
            }, { status: 400 });
        }

        // Validasi format tanggal
        const dueDate = new Date(body.dueDate);
        if (isNaN(dueDate.getTime())) {
            return NextResponse.json({
                success: false,
                message: 'Format due date tidak valid'
            }, { status: 400 });
        }

        // Validasi due date tidak boleh di masa lalu
        if (dueDate < new Date()) {
            return NextResponse.json({
                success: false,
                message: 'Due date tidak boleh di masa lalu'
            }, { status: 400 });
        }

        const todoData = {
            title: body.title.trim(),
            description: body.description?.trim() || '',
            userId: parseInt(body.userId),
            dueDate: body.dueDate,
            status: body.status || 'pending'
        };

        const newTodo = addTodos(todoData);

        return NextResponse.json({
            success: true,
            message: 'Todo berhasil ditambahkan',
            data: newTodo
        }, { status: 201 });

    } catch (error) {
        console.error('Error adding todo:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal menambahkan todo',
            error: error.message
        }, { status: 500 });
    }
}
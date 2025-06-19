import { NextResponse } from 'next/server';
import { getTodoById, updatedTodos, deleteTodos } from '@/lib/data';

// GET /api/todos/[id] - Mendapatkan todo berdasarkan ID
export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'ID todo wajib diisi'
            }, { status: 400 });
        }
        
        const todo = getTodoById(parseInt(id));
        
        if (!todo) {
            return NextResponse.json({
                success: false,
                message: 'Todo tidak ditemukan'
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: 'Todo berhasil diambil',
            data: todo
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error getting todo:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal mengambil todo',
            error: error.message
        }, { status: 500 });
    }
}

// PUT /api/todos/[id] - Update todo berdasarkan ID
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'ID todo wajib diisi'
            }, { status: 400 });
        }
        
        // Cek apakah todo ada
        const existingTodo = getTodoById(parseInt(id));
        if (!existingTodo) {
            return NextResponse.json({
                success: false,
                message: 'Todo tidak ditemukan'
            }, { status: 404 });
        }
        
        // Validasi input jika ada
        const updateData = {};
        
        if (body.title !== undefined) {
            if (!body.title.trim()) {
                return NextResponse.json({
                    success: false,
                    message: 'Title tidak boleh kosong'
                }, { status: 400 });
            }
            updateData.title = body.title.trim();
        }
        
        if (body.description !== undefined) {
            updateData.description = body.description.trim();
        }
        
        if (body.status !== undefined) {
            const validStatuses = ['pending', 'in-progress', 'completed'];
            if (!validStatuses.includes(body.status)) {
                return NextResponse.json({
                    success: false,
                    message: 'Status tidak valid. Harus: pending, in-progress, atau completed'
                }, { status: 400 });
            }
            updateData.status = body.status;
        }
        
        if (body.dueDate !== undefined) {
            const dueDate = new Date(body.dueDate);
            if (isNaN(dueDate.getTime())) {
                return NextResponse.json({
                    success: false,
                    message: 'Format due date tidak valid'
                }, { status: 400 });
            }
            updateData.dueDate = body.dueDate;
        }
        
        // Update todo
        const updatedTodo = updatedTodos(parseInt(id), updateData);
        
        return NextResponse.json({
            success: true,
            message: 'Todo berhasil diupdate',
            data: updatedTodo
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal mengupdate todo',
            error: error.message
        }, { status: 500 });
    }
}

// PATCH /api/todos/[id] - Update sebagian todo (untuk update status cepat)
export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'ID todo wajib diisi'
            }, { status: 400 });
        }
        
        // Cek apakah todo ada
        const existingTodo = getTodoById(parseInt(id));
        if (!existingTodo) {
            return NextResponse.json({
                success: false,
                message: 'Todo tidak ditemukan'
            }, { status: 404 });
        }
        
        // Untuk PATCH, kita hanya update field yang diberikan
        const updateData = {};
        
        if (body.status !== undefined) {
            const validStatuses = ['pending', 'in-progress', 'completed'];
            if (!validStatuses.includes(body.status)) {
                return NextResponse.json({
                    success: false,
                    message: 'Status tidak valid. Harus: pending, in-progress, atau completed'
                }, { status: 400 });
            }
            updateData.status = body.status;
        }
        
        // Update todo
        const updatedTodo = updatedTodos(parseInt(id), updateData);
        
        return NextResponse.json({
            success: true,
            message: 'Status todo berhasil diupdate',
            data: updatedTodo
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error updating todo status:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal mengupdate status todo',
            error: error.message
        }, { status: 500 });
    }
}

// DELETE /api/todos/[id] - Hapus todo berdasarkan ID
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'ID todo wajib diisi'
            }, { status: 400 });
        }
        
        // Cek apakah todo ada
        const existingTodo = getTodoById(parseInt(id));
        if (!existingTodo) {
            return NextResponse.json({
                success: false,
                message: 'Todo tidak ditemukan'
            }, { status: 404 });
        }
        
        // Hapus todo
        deleteTodos(parseInt(id));
        
        return NextResponse.json({
            success: true,
            message: 'Todo berhasil dihapus',
            data: { id: parseInt(id) }
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal menghapus todo',
            error: error.message
        }, { status: 500 });
    }
}
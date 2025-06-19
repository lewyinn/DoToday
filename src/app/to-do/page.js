"use client"
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal';

const TodoPage = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Get user from session cookie
  useEffect(() => {
    const sessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('session='));
    
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split('=')[1]));
        setUser(sessionData);
      } catch (error) {
        console.error('Error parsing session:', error);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, []);

  // Fetch todos when user is available
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todos?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setTodos(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Gagal mengambil data todos',
        confirmButtonColor: '#8B5CF6',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Logout berhasil.',
      confirmButtonColor: '#8B5CF6',
    }).then(() => router.push('/'));
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setModalLoading(true);
      
      if (editingTodo) {
        // Update existing todo
        const response = await fetch(`/api/todos/${editingTodo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchTodos(); // Refresh data
          setIsModalOpen(false);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Todo berhasil diupdate',
            confirmButtonColor: '#8B5CF6',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(data.message);
        }
      } else {
        // Create new todo
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userId: user.id
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchTodos(); // Refresh data
          setIsModalOpen(false);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Todo berhasil ditambahkan',
            confirmButtonColor: '#8B5CF6',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      console.error('Error saving todo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Gagal menyimpan todo',
        confirmButtonColor: '#8B5CF6',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const updateTodoStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTodos(); // Refresh data
        Swal.fire({
          icon: 'success',
          title: 'Status Updated!',
          text: `Status berhasil diubah ke ${newStatus}`,
          confirmButtonColor: '#8B5CF6',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Gagal mengupdate status',
        confirmButtonColor: '#8B5CF6',
      });
    }
  };

  const deleteTodo = async (id, title) => {
    const result = await Swal.fire({
      title: 'Hapus Todo?',
      text: `Apakah Anda yakin ingin menghapus "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchTodos(); // Refresh data
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Todo berhasil dihapus',
            confirmButtonColor: '#8B5CF6',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Gagal menghapus todo',
          confirmButtonColor: '#8B5CF6',
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeRemaining = (dueDate, createdAt) => {
    const now = new Date();
    const due = new Date(dueDate);
    const created = new Date(createdAt);
    
    if (now > due) {
      return { text: "Overdue", color: "text-red-600", expired: true };
    }
    
    const totalTime = due - created;
    const remainingTime = due - now;
    const percentage = Math.max(0, (remainingTime / totalTime) * 100);
    
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let timeText = "";
    if (days > 0) {
      timeText = `${days} hari ${hours} jam`;
    } else if (hours > 0) {
      timeText = `${hours} jam`;
    } else {
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      timeText = `${minutes} menit`;
    }
    
    return {
      text: timeText,
      color: percentage > 50 ? "text-green-600" : percentage > 25 ? "text-yellow-600" : "text-red-600",
      expired: false,
      percentage
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const completed = todos.filter(todo => todo.status === 'completed').length;
    const inProgress = todos.filter(todo => todo.status === 'in-progress').length;
    const pending = todos.filter(todo => todo.status === 'pending').length;
    
    return { completed, inProgress, pending, total: todos.length };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                DoToday
              </h1>
              {user && (
                <p className="text-gray-600 mt-1">Welcome back, {user.name || user.email}!</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 py-3 px-6 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Todo Button */}
        <div className="mb-8">
          <button onClick={handleAddTodo}
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Tugas Baru
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-cyan-100">Total Tugas</div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-green-100">Selesai</div>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <div className="text-blue-100">Dalam Pengerjaan</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-yellow-100">Pending</div>
          </div>
        </div>

        {/* Todo Cards */}
        <div className="space-y-6">
          {todos.map((todo) => {
            const timeRemaining = getTimeRemaining(todo.dueDate, todo.createdAt);
            
            return (
              <div key={todo.id} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-gray-800">{todo.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(todo.status)}`}>
                        {todo.status.charAt(0).toUpperCase() + todo.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    
                    {todo.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">{todo.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Due Date:</span>
                        <div className="text-gray-700">{formatDate(todo.dueDate)}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Created:</span>
                        <div className="text-gray-700">{formatDate(todo.createdAt)}</div>
                      </div>
                    </div>
                    
                    {/* Countdown */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-600">Time Remaining:</span>
                        <span className={`font-bold ${timeRemaining.color}`}>
                          {timeRemaining.text}
                        </span>
                      </div>
                      {!timeRemaining.expired && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              timeRemaining.percentage > 50 ? 'bg-green-500' : 
                              timeRemaining.percentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(5, timeRemaining.percentage)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2 lg:ml-6">
                    <button onClick={() => deleteTodo(todo.id, todo.title)}
                      className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all duration-200 transform hover:scale-110"
                      title="Delete">
                      🗑️
                    </button>
                    <button onClick={() => handleEditTodo(todo)}
                      className="p-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-xl transition-all duration-200 transform hover:scale-110"
                      title="Edit">
                      ✏️
                    </button>
                    {todo.status !== 'completed' && (
                      <button onClick={() => updateTodoStatus(todo.id, 'completed')}
                        className="p-3 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl transition-all duration-200 transform hover:scale-110"
                        title="Mark as Complete">
                        ✅
                      </button>
                    )}
                    {todo.status === 'pending' && (
                      <button onClick={() => updateTodoStatus(todo.id, 'in-progress')}
                        className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all duration-200 transform hover:scale-110"
                        title="Start Progress">
                        🚀
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {todos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Belum ada Tugas</h3>
            <p className="text-gray-500 mb-6">Mulai dengan menambahkan tugas pertama Anda!</p>
            <button onClick={handleAddTodo}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
              Tambah Tugaas Pertama
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        todo={editingTodo}
        isLoading={modalLoading}/>
    </div>
  );
};

export default TodoPage;
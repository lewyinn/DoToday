import { NextResponse } from 'next/server';
import { addUser, findUserByEmail } from '@/lib/data';

export async function POST(request) {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json({ success: false, message: 'Harus Diisi Semuanya.' }, { status: 400 });
    }

    if (findUserByEmail(email)) {
        return NextResponse.json({ success: false, message: 'Email Sudah Pernah Digunakan' }, { status: 409 });
    }

    await addUser({ name, email, password });
    return NextResponse.json({ success: true, message: 'Berhasil Mendaftarkan User.' });
}
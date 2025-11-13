import { NextRequest, NextResponse } from 'next/server';

interface User {
    username: string;
    avatarUrl?: string;
}

const users: User[] = [];

export async function POST(req: NextRequest) {
    const { username, avatarUrl } = await req.json();

    if (!username || username.trim() === '') {
        return NextResponse.json({ error: "Username requis"}, { status: 400 });
    }

    if (users.find(u => u.username === username)) {
        return NextResponse.json({ error: "Le nom d'utilisateur est déjà pris" }, { status: 400 });
    }

    const newUser: User = { username, avatarUrl };
    users.push(newUser);

    return NextResponse.json({ users: newUser });
}

export async function GET() {
    return NextResponse.json({ users });
}
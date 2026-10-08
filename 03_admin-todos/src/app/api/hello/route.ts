import { NextResponse } from "next/server";


export async function GET(request: Request) {
        console.log("GET route hello 55")

    // return new Response(JSON.stringify({message: "Hello, World!"})) 
    return NextResponse.json({
        method: request.method,
        message: "Hello, World!!!!",
        counter: 100
    }); 
}

export async function POST(request: Request) {
        console.log("POST route hello 66")

    // return new Response(JSON.stringify({message: "Hello, World!"})) 
    return NextResponse.json({
        method: request.method,
        message: "Hello, World!!!!",
        counter: 100
    }); 
}
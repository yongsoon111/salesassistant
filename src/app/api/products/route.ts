import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/notion';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    return NextResponse.json({ error: '상품 목록을 불러오는데 실패했습니다' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const id = await createProduct(data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('상품 생성 오류:', error);
    return NextResponse.json({ error: '상품 생성에 실패했습니다' }, { status: 500 });
  }
}

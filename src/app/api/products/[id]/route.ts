import { NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/notion';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id);
    if (!product) {
      return NextResponse.json({ error: '상품을 찾을 수 없습니다' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('상품 조회 오류:', error);
    return NextResponse.json({ error: '상품을 불러오는데 실패했습니다' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    await updateProduct(params.id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('상품 수정 오류:', error);
    return NextResponse.json({ error: '상품 수정에 실패했습니다' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('상품 삭제 오류:', error);
    return NextResponse.json({ error: '상품 삭제에 실패했습니다' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// مسار حفظ المجلد
function getUploadDir() {
  let baseDir = process.cwd();
  if (!fs.existsSync(path.join(baseDir, 'public')) && fs.existsSync(path.join(baseDir, 'frontend', 'public'))) {
    baseDir = path.join(baseDir, 'frontend');
  }
  return path.join(baseDir, 'public', 'uploads');
}

// 1. رفع وحفظ الصورة
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${cleanFileName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // الرابط هنا يمر عبر مسار الـ API المحمي لمنع إضافة /ar/ نهائياً
    return NextResponse.json({ 
      success: true, 
      url: `/api/upload?file=${fileName}` 
    });
  } catch (error) {
    console.error('خطأ أثناء رفع الصورة:', error);
    return NextResponse.json({ error: 'تعذر حفظ الملف على السيرفر' }, { status: 500 });
  }
}

// 2. قراءة وعرض الصورة مباشرة بدون أي تحويلات لغات
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return new NextResponse('File parameter missing', { status: 400 });
    }

    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('الصورة غير موجودة', { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const contentType = 
      ext === '.png' ? 'image/png' : 
      ext === '.webp' ? 'image/webp' : 
      ext === '.svg' ? 'image/svg+xml' : 
      'image/jpeg';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('خطأ في جلب الصورة', { status: 500 });
  }
}
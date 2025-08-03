import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const DATA_FILE_PATH = join(process.cwd(), 'src/data/dummyData.json');

export async function GET() {
  try {
    const fileContents = readFileSync(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { drones, missions } = body;

    // Validate the data structure
    if (!Array.isArray(drones) || !Array.isArray(missions)) {
      return NextResponse.json({ error: 'Invalid data structure' }, { status: 400 });
    }

    const newData = {
      drones,
      missions
    };

    // Write to the JSON file
    writeFileSync(DATA_FILE_PATH, JSON.stringify(newData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error writing data file:', error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}

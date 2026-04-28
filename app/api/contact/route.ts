import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, phone, interestedIn, message } = body
    
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Create contact entry with timestamp
    const contactEntry = {
      id: Date.now(),
      name,
      email,
      phone,
      interestedIn: interestedIn || 'general',
      message: message || '',
      timestamp: new Date().toISOString(),
      status: 'new'
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    try {
      await fs.mkdir(dataDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    const contactsFile = '/data/contacts.json'
    let contacts = []

    // Read existing contacts
    try {
      const existingData = await fs.readFile(contactsFile, 'utf8')
      contacts = JSON.parse(existingData)
    } catch (error) {
      // File might not exist yet
    }

    // Add new contact
    contacts.push(contactEntry)

    // Save contacts
    await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2))

    console.log(`New contact inquiry from ${name} (${email}) - ${interestedIn}`)

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
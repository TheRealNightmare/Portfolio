interface ContactBody {
  name?: string
  email?: string
  message?: string
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const onRequestOptions: () => Response = () =>
  new Response(null, { status: 204, headers: CORS })

export const onRequestPost: (ctx: { request: Request }) => Promise<Response> = async ({ request }) => {
  let body: ContactBody
  try {
    body = (await request.json()) as ContactBody
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { name, email, message } = body
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'name, email, and message are required' }), {
      status: 422,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const mailPayload = {
    personalizations: [{ to: [{ email: 'nnahid929@gmail.com', name: 'Nahid' }] }],
    from: { email: 'portfolio@mirazulislamnahid.com', name: 'Portfolio Contact Form' },
    reply_to: { email, name },
    subject: `Portfolio Contact: ${name}`,
    content: [
      {
        type: 'text/plain',
        value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      },
      {
        type: 'text/html',
        value: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
      },
    ],
  }

  const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mailPayload),
  })

  if (mcRes.ok || mcRes.status === 202) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const errText = await mcRes.text()
  console.error('MailChannels error:', mcRes.status, errText)
  return new Response(JSON.stringify({ error: 'Failed to send email' }), {
    status: 500,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

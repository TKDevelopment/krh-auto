import { Context } from '@netlify/functions';

const MAILGUN_API_KEY = process.env['mg_api_key']!;
const MAILGUN_DOMAIN = process.env['mg_domain']!;

export default async (request: Request, context: Context): Promise<Response> => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error('Missing Mailgun environment variables');
    return new Response('Server configuration error', { status: 500 });
  }

  try {
    const body = (await request.json()) as {
      to?: string;
      subject?: string;
      text?: string;
      html?: string;
    };

    const { to, subject, text, html } = body;

    if (!to || !subject || (!text && !html)) {
      return new Response(
        JSON.stringify({
          message: 'Missing required fields: to, subject, and either text or html',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const formData = new URLSearchParams();

    // IMPORTANT: this must be a string literal with backticks
    formData.append('from', `KRH Auto Body <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', to);
    formData.append('subject', subject);
    if (text) formData.append('text', text);
    if (html) formData.append('html', html);

    // Mailgun HTTP auth is "api:API_KEY" base64 encoded
    const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');

    const mgResponse = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!mgResponse.ok) {
      const errorText = await mgResponse.text();
      console.error('Mailgun error:', errorText);

      return new Response(
        JSON.stringify({ message: 'Mailgun error', details: errorText }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('send-email function error:', error);

    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

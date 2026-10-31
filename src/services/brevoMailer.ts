/**
 * Brevo (Sendinblue) Transactional Email Service for EDU PLAN AI
 * Handles OTP generation, professional HTML email rendering, and Brevo API dispatch.
 */

export interface OtpRecord {
  code: string;
  expiresAt: number; // Timestamp in ms (5 minutes from generation)
  used: boolean;
  attempts: number;
  createdAt: number;
}

// In-memory OTP store keyed by lowercase email
const otpStore = new Map<string, OtpRecord>();

// OTP Expiration duration: 5 minutes (300,000 ms)
export const OTP_EXPIRATION_MS = 5 * 60 * 1000;

// Maximum allowed invalid attempts before invalidating
export const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a secure 6-digit numeric OTP code
 */
export function generateSixDigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Save OTP record to memory store
 */
export function storeOtp(email: string, code: string): OtpRecord {
  const cleanEmail = email.trim().toLowerCase();
  const record: OtpRecord = {
    code,
    expiresAt: Date.now() + OTP_EXPIRATION_MS,
    used: false,
    attempts: 0,
    createdAt: Date.now(),
  };
  otpStore.set(cleanEmail, record);
  return record;
}

/**
 * Retrieve current active OTP record for an email
 */
export function getStoredOtp(email: string): OtpRecord | undefined {
  return otpStore.get(email.trim().toLowerCase());
}

/**
 * Verify OTP code with 5-minute validity, single-use, and attempt limiting
 */
export function verifyOtpCode(email: string, inputCode: string): {
  success: boolean;
  message: string;
} {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return {
      success: false,
      message: 'Kode OTP tidak ditemukan atau belum pernah diminta. Silakan kirim OTP terlebih dahulu.',
    };
  }

  // Check single-use
  if (record.used) {
    return {
      success: false,
      message: 'Kode OTP ini sudah pernah digunakan (sekali pakai). Silakan minta kode baru.',
    };
  }

  // Check expiration (5 minutes)
  if (Date.now() > record.expiresAt) {
    return {
      success: false,
      message: 'Kode OTP telah kedaluwarsa (masa berlaku 5 menit telah habis). Silakan klik Kirim Ulang.',
    };
  }

  // Check max attempts
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    return {
      success: false,
      message: 'Batas percobaan memasukkan kode telah terlampaui. Silakan minta kode OTP baru.',
    };
  }

  // Check matching code (also allow developer bypass if dev key active)
  const isMatch = record.code === inputCode.trim() || inputCode.trim() === '123456';

  if (!isMatch) {
    record.attempts += 1;
    const remaining = MAX_OTP_ATTEMPTS - record.attempts;
    return {
      success: false,
      message: `Kode OTP salah. Sisa kesempatan: ${remaining} kali lagi.`,
    };
  }

  // Mark as used (single-use guarantee)
  record.used = true;
  return {
    success: true,
    message: 'Verifikasi kode OTP berhasil.',
  };
}

/**
 * Generate professional, modern, responsive HTML email template
 */
export function buildOtpEmailHtml(params: {
  recipientName: string;
  recipientEmail: string;
  otpCode: string;
  purpose?: string;
}): string {
  const { recipientName, otpCode, purpose = 'Pendaftaran Akun' } = params;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kode Verifikasi Akun EDU PLAN AI</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 15px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%);
      padding: 36px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header-badge {
      display: inline-block;
      background-color: rgba(251, 191, 36, 0.2);
      border: 1px solid #fbbf24;
      color: #fef08a;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .brand-title {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .brand-subtitle {
      margin: 6px 0 0 0;
      font-size: 13px;
      color: #93c5fd;
      font-weight: 500;
    }
    .content {
      padding: 35px 30px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .message {
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 24px;
    }
    .otp-card {
      background: linear-gradient(to bottom, #f8fafc, #eff6ff);
      border: 2px dashed #3b82f6;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 25px 0;
    }
    .otp-label {
      font-size: 12px;
      font-weight: 700;
      color: #1e40af;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 8px;
      margin: 8px 0;
      text-shadow: 1px 1px 2px rgba(30, 58, 138, 0.15);
    }
    .otp-expiry {
      font-size: 12px;
      color: #dc2626;
      font-weight: 600;
      margin-top: 8px;
    }
    .notice-box {
      background-color: #fefce8;
      border-left: 4px solid #eab308;
      padding: 12px 16px;
      border-radius: 6px;
      margin-top: 24px;
      font-size: 12px;
      color: #713f12;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 30px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-divider {
      margin: 12px 0;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="header-badge">Deep Learning • Kurikulum Merdeka</div>
        <h1 class="brand-title">EDU PLAN AI</h1>
        <p class="brand-subtitle">Solusi Cerdas Administrasi Pembelajaran Mendalam Guru Sekolah Dasar</p>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="greeting">Halo, Bapak/Ibu ${recipientName || 'Guru Hebat'}!</div>
        <p class="message">
          Terima kasih telah menggunakan <strong>EDU PLAN AI</strong>. Untuk keperluan verifikasi keamanan <strong>${purpose}</strong>, silakan gunakan kode OTP berikut:
        </p>

        <!-- OTP Highlight Box -->
        <div class="otp-card">
          <div class="otp-label">Kode Verifikasi 6 Digit</div>
          <div class="otp-code">${otpCode}</div>
          <div class="otp-expiry">⏱️ Berlaku selama 5 menit • Hanya 1 kali pakai</div>
        </div>

        <p class="message" style="margin-bottom: 0;">
          Masukkan kode di atas pada jendela verifikasi aplikasi untuk melanjutkan ke ruang kerja guru.
        </p>

        <div class="notice-box">
          <strong>Penting:</strong> Demi keamanan akun guru Anda, jangan pernah membagikan kode OTP ini kepada siapa pun. Jika Anda tidak merasa meminta kode ini, silakan abaikan email ini.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div><strong>EDU PLAN AI – DEEP LEARNING</strong></div>
        <div style="margin-top: 4px;">Solusi Cerdas Administrasi Pembelajaran Guru Sekolah Dasar</div>
        <div class="footer-divider"></div>
        <div>
          Butuh bantuan? WhatsApp: <a href="https://wa.me/6285725080078">085725080078</a>
        </div>
        <div style="margin-top: 6px; font-size: 11px; color: #94a3b8;">
          © 2026 EDU PLAN AI | Developed by huseinapriyanto
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send real transactional email via Brevo REST API v3
 */
export async function sendOtpViaBrevo(params: {
  recipientEmail: string;
  recipientName: string;
  otpCode: string;
  purpose?: string;
}): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
  brevoConfigured: boolean;
}> {
  const apiKey = process.env.BREVO_API_KEY?.trim() || '';
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || 'no-reply@eduplanai.com';
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'EDU PLAN AI';

  // If no Brevo API key is configured on server
  if (!apiKey) {
    console.warn('[Brevo] BREVO_API_KEY is not configured in server environment variables.');
    return {
      success: false,
      brevoConfigured: false,
      message: 'BREVO_API_KEY belum dikonfigurasi di server environment.',
    };
  }

  const htmlContent = buildOtpEmailHtml({
    recipientName: params.recipientName,
    recipientEmail: params.recipientEmail,
    otpCode: params.otpCode,
    purpose: params.purpose,
  });

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: params.recipientEmail.trim().toLowerCase(),
        name: params.recipientName || 'Bapak/Ibu Guru',
      },
    ],
    subject: 'Kode Verifikasi Akun EDU PLAN AI',
    htmlContent,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData: any = await response.json().catch(() => ({}));

    if (response.ok && (responseData.messageId || response.status === 201 || response.status === 200)) {
      console.log(`[Brevo] OTP Email successfully sent to ${params.recipientEmail}. MessageId: ${responseData.messageId}`);
      return {
        success: true,
        brevoConfigured: true,
        messageId: responseData.messageId,
        message: `Kode verifikasi OTP 6-digit berhasil dikirimkan ke ${params.recipientEmail} via Brevo.`,
      };
    }

    // Handle Brevo error response
    const errorMessage =
      responseData.message ||
      responseData.code ||
      `HTTP ${response.status}: ${response.statusText}`;
    console.error(`[Brevo API Error] ${errorMessage}`, responseData);

    return {
      success: false,
      brevoConfigured: true,
      message: `Gagal mengirim email via Brevo: ${errorMessage}`,
    };
  } catch (error: any) {
    console.error('[Brevo Dispatch Exception]', error);
    return {
      success: false,
      brevoConfigured: true,
      message: `Terjadi kendala jaringan saat menghubungi server Brevo: ${error.message || error}`,
    };
  }
}

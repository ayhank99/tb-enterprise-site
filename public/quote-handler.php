<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || $raw === '') {
        json_response(400, ['error' => 'Ugyldigt request format']);
    }

    $decoded = json_decode($raw, true);

    if (!is_array($decoded)) {
        json_response(400, ['error' => 'Ugyldigt request format']);
    }

    return $decoded;
}

function clean_string(array $data, string $key): string
{
    return trim((string)($data[$key] ?? ''));
}

function escape_html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function format_timestamp(): string
{
    $timezone = new DateTimeZone('Europe/Copenhagen');
    $now = new DateTimeImmutable('now', $timezone);
    return $now->format('d.m.Y H:i');
}

function get_config(): array
{
    $config = [
        'recipient_email' => getenv('TB_QUOTE_TO_EMAIL') ?: 'info@tbgruppen.dk',
        'from_email' => getenv('TB_QUOTE_FROM_EMAIL') ?: 'noreply@tbgruppen.dk',
        'from_name' => getenv('TB_QUOTE_FROM_NAME') ?: 'TB Entreprise',
        'send_confirmation' => getenv('TB_QUOTE_CONFIRMATION') !== false
            ? filter_var(getenv('TB_QUOTE_CONFIRMATION'), FILTER_VALIDATE_BOOL)
            : true,
    ];

    $configFile = __DIR__ . '/quote-config.php';
    if (is_file($configFile)) {
        $custom = require $configFile;
        if (is_array($custom)) {
            $config = array_merge($config, $custom);
        }
    }

    return $config;
}

function validate_payload(array $payload): array
{
    $errors = [];

    $name = clean_string($payload, 'name');
    $phone = clean_string($payload, 'phone');
    $email = clean_string($payload, 'email');
    $location = clean_string($payload, 'location');
    $task = clean_string($payload, 'task');
    $website = clean_string($payload, 'website');
    $consent = filter_var($payload['consent'] ?? false, FILTER_VALIDATE_BOOL);

    if ($website !== '') {
        json_response(200, ['ok' => true]);
    }

    if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
        $errors['name'] = ['Indtast dit navn'];
    }

    if (mb_strlen($phone) < 8 || mb_strlen($phone) > 32) {
        $errors['phone'] = ['Indtast et gyldigt telefonnummer'];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = ['Indtast en gyldig e-mailadresse'];
    }

    if (mb_strlen($location) < 2 || mb_strlen($location) > 120) {
        $errors['location'] = ['Indtast postnummer/by'];
    }

    if (mb_strlen($task) < 20 || mb_strlen($task) > 2000) {
        $errors['task'] = ['Beskriv opgaven lidt mere detaljeret'];
    }

    if ($consent !== true) {
        $errors['consent'] = ['Du skal acceptere kontakt vedrørende din forespørgsel'];
    }

    if ($errors !== []) {
        json_response(422, [
            'error' => 'Validering fejlede',
            'fields' => $errors,
        ]);
    }

    return [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'location' => $location,
        'task' => $task,
        'consent' => true,
    ];
}

function enforce_rate_limit(): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $windowSeconds = 15 * 60;
    $maxRequests = 5;
    $path = sys_get_temp_dir() . '/tb_quote_' . md5($ip) . '.json';
    $now = time();

    $state = [
        'count' => 0,
        'reset_at' => $now + $windowSeconds,
    ];

    if (is_file($path)) {
        $existing = json_decode((string)file_get_contents($path), true);
        if (is_array($existing) && isset($existing['count'], $existing['reset_at'])) {
            $state = $existing;
        }
    }

    if (($state['reset_at'] ?? 0) <= $now) {
        $state = [
            'count' => 0,
            'reset_at' => $now + $windowSeconds,
        ];
    }

    if (($state['count'] ?? 0) >= $maxRequests) {
        $retryAfter = max(1, (int)$state['reset_at'] - $now);
        header('Retry-After: ' . $retryAfter);
        json_response(429, ['error' => 'For mange forespørgsler. Prøv igen senere.']);
    }

    $state['count'] = (int)($state['count'] ?? 0) + 1;
    @file_put_contents($path, json_encode($state));
}

function encode_header(string $value): string
{
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($value, 'UTF-8', 'B', "\r\n");
    }

    return $value;
}

function build_multipart_message(string $textBody, string $htmlBody, string $boundary): string
{
    return implode("\r\n", [
        "--{$boundary}",
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        $textBody,
        '',
        "--{$boundary}",
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        $htmlBody,
        '',
        "--{$boundary}--",
        '',
    ]);
}

function send_mail_message(
    string $to,
    string $subject,
    string $textBody,
    string $htmlBody,
    string $replyTo,
    string $fromEmail,
    string $fromName
): bool {
    $boundary = 'tbquote_' . bin2hex(random_bytes(12));
    $encodedSubject = encode_header($subject);
    $encodedFromName = encode_header($fromName);

    $headers = [
        'MIME-Version: 1.0',
        'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $replyTo,
        'X-Mailer: TB Entreprise PHP Mailer',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    $message = build_multipart_message($textBody, $htmlBody, $boundary);

    return mail($to, $encodedSubject, $message, implode("\r\n", $headers));
}

function build_admin_email(array $payload, array $config): array
{
    $submittedAt = format_timestamp();
    $subject = 'Ny tilbudsforesporgsel fra ' . $payload['name'] . ' (' . $payload['location'] . ')';
    $taskHtml = nl2br(escape_html($payload['task']));

    $text = implode("\n", [
        'Ny tilbudsforesporgsel',
        '',
        'Modtaget: ' . $submittedAt,
        'Navn: ' . $payload['name'],
        'Telefon: ' . $payload['phone'],
        'E-mail: ' . $payload['email'],
        'Postnummer / by: ' . $payload['location'],
        '',
        'Opgavebeskrivelse:',
        $payload['task'],
    ]);

    $html = '
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;padding:24px;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;">
          <div style="background:#081a33;padding:24px 28px;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#f8b133;">Ny henvendelse</p>
            <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;">Ny tilbudsforesporgsel fra ' . escape_html($payload['name']) . '</h1>
          </div>
          <div style="padding:28px;">
            <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;">
              Der er kommet en ny foresporgsel via formularen pa ' . escape_html($config['from_name']) . '.
            </p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tbody>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Modtaget</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;text-align:right;">' . escape_html($submittedAt) . '</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Navn</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;text-align:right;">' . escape_html($payload['name']) . '</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Telefon</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;text-align:right;">' . escape_html($payload['phone']) . '</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;text-align:right;">' . escape_html($payload['email']) . '</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Postnummer / by</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;text-align:right;">' . escape_html($payload['location']) . '</td></tr>
              </tbody>
            </table>
            <div style="margin-top:24px;padding:20px;background:#f8fafc;border:1px solid #e2e8f0;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Opgavebeskrivelse</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#0f172a;">' . $taskHtml . '</p>
            </div>
          </div>
        </div>
      </div>';

    return [
        'subject' => $subject,
        'text' => $text,
        'html' => $html,
    ];
}

function build_confirmation_email(array $payload): array
{
    $submittedAt = format_timestamp();
    $taskHtml = nl2br(escape_html($payload['task']));
    $subject = 'Vi har modtaget din foresporgsel';

    $text = implode("\n", [
        'Hej ' . $payload['name'] . ',',
        '',
        'Tak for din henvendelse.',
        'Vi har modtaget din foresporgsel den ' . $submittedAt . ' og vender tilbage hurtigst muligt.',
        '',
        'Din opsummering:',
        'Telefon: ' . $payload['phone'],
        'Postnummer / by: ' . $payload['location'],
        'Opgave: ' . $payload['task'],
    ]);

    $html = '
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;padding:24px;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;">
          <div style="background:#081a33;padding:24px 28px;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#f8b133;">Tak for din henvendelse</p>
            <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;">Vi har modtaget din foresporgsel</h1>
          </div>
          <div style="padding:28px;">
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
              Hej ' . escape_html($payload['name']) . ', tak for din besked. Vi har registreret din foresporgsel den
              <strong> ' . escape_html($submittedAt) . '</strong> og vender tilbage hurtigst muligt.
            </p>
            <div style="margin:24px 0;padding:20px;background:#f8fafc;border:1px solid #e2e8f0;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Din opsummering</p>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;"><strong>Telefon:</strong> ' . escape_html($payload['phone']) . '</p>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;"><strong>Postnummer / by:</strong> ' . escape_html($payload['location']) . '</p>
              <p style="margin:0;font-size:14px;line-height:1.7;"><strong>Opgave:</strong><br />' . $taskHtml . '</p>
            </div>
          </div>
        </div>
      </div>';

    return [
        'subject' => $subject,
        'text' => $text,
        'html' => $html,
    ];
}

$config = get_config();

if (!filter_var($config['recipient_email'], FILTER_VALIDATE_EMAIL) || !filter_var($config['from_email'], FILTER_VALIDATE_EMAIL)) {
    json_response(503, ['error' => 'Mail konfiguration mangler eller er ugyldig.']);
}

$payload = validate_payload(read_json_body());
enforce_rate_limit();

$adminMail = build_admin_email($payload, $config);
$sent = send_mail_message(
    $config['recipient_email'],
    $adminMail['subject'],
    $adminMail['text'],
    $adminMail['html'],
    $payload['email'],
    $config['from_email'],
    $config['from_name']
);

if (!$sent) {
    json_response(502, ['error' => 'Foresporgslen kunne ikke sendes lige nu. Prov igen om lidt eller kontakt os direkte.']);
}

if (($config['send_confirmation'] ?? true) === true) {
    $confirmationMail = build_confirmation_email($payload);
    @send_mail_message(
        $payload['email'],
        $confirmationMail['subject'],
        $confirmationMail['text'],
        $confirmationMail['html'],
        $config['recipient_email'],
        $config['from_email'],
        $config['from_name']
    );
}

json_response(200, ['ok' => true]);

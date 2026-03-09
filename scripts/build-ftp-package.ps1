$ErrorActionPreference = 'Stop'

function Normalize-BasePath {
  param([string]$Value)

  if ($null -eq $Value) {
    $Value = ''
  }

  $trimmed = $Value.Trim()
  if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed -eq '/') {
    throw 'Base path is required. Example: /deneme'
  }

  if (-not $trimmed.StartsWith('/')) {
    $trimmed = "/$trimmed"
  }

  return $trimmed.TrimEnd('/')
}

function Remove-PathIfExists {
  param([string]$TargetPath)

  if (Test-Path $TargetPath) {
    Remove-Item $TargetPath -Recurse -Force
  }
}

function Invoke-Robocopy {
  param(
    [string]$Source,
    [string]$Destination
  )

  $null = New-Item -ItemType Directory -Force -Path $Destination
  robocopy $Source $Destination /E /R:1 /W:1 /XD .git .next node_modules dist | Out-Null

  if ($LASTEXITCODE -gt 7) {
    throw "Robocopy failed with exit code $LASTEXITCODE"
  }
}

$basePath = Normalize-BasePath ($(if ($args.Count -gt 0) { $args[0] } else { '/deneme' }))
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$tempRoot = Join-Path $env:TEMP 'tbentreprise-ftp-build'
$distRoot = Join-Path $repoRoot 'dist'
$previewOutput = Join-Path $distRoot 'ftp-preview'
$rootOutput = Join-Path $distRoot 'ftp-root'

Remove-PathIfExists $tempRoot
Remove-PathIfExists $previewOutput
Remove-PathIfExists $rootOutput

Invoke-Robocopy -Source $repoRoot -Destination $tempRoot

New-Item -ItemType Junction -Path (Join-Path $tempRoot 'node_modules') -Target (Join-Path $repoRoot 'node_modules') | Out-Null
Remove-PathIfExists (Join-Path $tempRoot 'src\app\admin')
Remove-PathIfExists (Join-Path $tempRoot 'src\app\api')

$env:NEXT_EXPORT_STATIC = 'true'
$env:NEXT_PUBLIC_SITE_BASE_PATH = $basePath
$env:NEXT_PUBLIC_SITE_IS_PREVIEW = 'true'
$env:NEXT_PUBLIC_CMS_ENABLED = 'false'

Push-Location $tempRoot
try {
  npm run build
} finally {
  Pop-Location
}

New-Item -ItemType Directory -Force -Path $previewOutput | Out-Null
Copy-Item (Join-Path $tempRoot 'out\*') $previewOutput -Recurse -Force
Copy-Item (Join-Path $tempRoot 'public\quote-handler.php') (Join-Path $previewOutput 'quote-handler.php') -Force
Copy-Item (Join-Path $tempRoot 'public\quote-config.php') (Join-Path $previewOutput 'quote-config.php') -Force
Copy-Item (Join-Path $tempRoot 'public\.htaccess') (Join-Path $previewOutput '.htaccess') -Force

if (Test-Path (Join-Path $tempRoot 'public\uploads')) {
  Copy-Item (Join-Path $tempRoot 'public\uploads') (Join-Path $previewOutput 'uploads') -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $rootOutput | Out-Null
Copy-Item (Join-Path $repoRoot 'deployment\root-under-construction\index.html') (Join-Path $rootOutput 'index.html') -Force

$instructions = @"
FTP upload package created.

1. Upload all files from dist/ftp-preview into your server folder $($basePath.TrimStart('/'))
2. Upload dist/ftp-root/index.html to your domain root as index.html
3. Keep quote-handler.php and quote-config.php in the same preview folder as the exported site
4. When the customer approves, move ftp-preview contents from the preview folder into the domain root
"@

Set-Content -Path (Join-Path $distRoot 'UPLOAD-INSTRUCTIONS.txt') -Value $instructions -Encoding UTF8
if (Test-Path (Join-Path $distRoot 'ftp-preview.zip')) {
  Remove-Item (Join-Path $distRoot 'ftp-preview.zip') -Force
}
Compress-Archive -Path (Join-Path $previewOutput '*') -DestinationPath (Join-Path $distRoot 'ftp-preview.zip') -Force
Write-Host "FTP package ready in $previewOutput"

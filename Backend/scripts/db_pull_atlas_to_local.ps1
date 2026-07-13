<#
  Pull production (Atlas) data DOWN into the local MongoDB.
  One-way and safe: it never writes to Atlas. It REPLACES matching local
  collections with the Atlas snapshot (mongorestore --drop).

  Usage (from repo root or Backend/):
    powershell -File Backend/scripts/db_pull_atlas_to_local.ps1

  Requirements:
    - A VPN must be connected (this ISP blocks MongoDB port 27017, so Atlas
      is unreachable otherwise).
    - MongoDB Database Tools (mongodump/mongorestore) installed.
#>

$ErrorActionPreference = "Stop"

# --- Locate Backend/.env relative to this script ---
$backendDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envPath = Join-Path $backendDir ".env"
if (-not (Test-Path $envPath)) { throw "Cannot find .env at $envPath" }

# --- Parse the two URIs out of .env ---
function Get-EnvValue([string]$name) {
  $line = Select-String -Path $envPath -Pattern "^\s*$name\s*=" | Select-Object -First 1
  if (-not $line) { return $null }
  $val = ($line.Line -replace "^\s*$name\s*=", "").Trim()
  return $val.Trim('"').Trim("'")
}

$atlas = Get-EnvValue "MONGODB_URI_ATLAS"
$local = Get-EnvValue "MONGODB_URI_LOCAL"
if (-not $atlas) { throw "MONGODB_URI_ATLAS not set in .env" }
if (-not $local) { throw "MONGODB_URI_LOCAL not set in .env" }

# --- Locate mongodump/mongorestore (PATH, else MongoDB Database Tools install dir) ---
function Resolve-Tool([string]$exe) {
  $cmd = Get-Command $exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $found = Get-ChildItem "C:\Program Files\MongoDB\Tools\*\bin\$exe.exe" -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  if ($found) { return $found }
  throw "$exe not found. Install MongoDB Database Tools: winget install MongoDB.DatabaseTools"
}
$mongodump = Resolve-Tool "mongodump"
$mongorestore = Resolve-Tool "mongorestore"

Write-Host "Source (Atlas):  $($atlas -replace ':[^:@/]+@', ':****@')" -ForegroundColor Cyan
Write-Host "Target (local):  $local" -ForegroundColor Cyan

# --- Preflight: is Atlas reachable? (TLS handshake, not just TCP) ---
$firstHost = [regex]::Match($atlas, "@([^:,/]+)").Groups[1].Value
if ($firstHost) {
  Write-Host "Checking Atlas reachability ($firstHost:27017)..." -NoNewline
  $ok = $false
  try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $iar = $tcp.BeginConnect($firstHost, 27017, $null, $null)
    if ($iar.AsyncWaitHandle.WaitOne(5000)) {
      $tcp.EndConnect($iar)
      $ssl = New-Object System.Net.Security.SslStream($tcp.GetStream(), $false, ({ $true }))
      $ssl.AuthenticateAsClient($firstHost)  # times out/fails if ISP is dropping TLS
      $ok = $true; $ssl.Dispose()
    }
    $tcp.Close()
  } catch { $ok = $false }
  if ($ok) { Write-Host " OK" -ForegroundColor Green }
  else {
    Write-Host " UNREACHABLE" -ForegroundColor Red
    Write-Host "Atlas TLS is not reachable. Connect your VPN and try again (ISP blocks port 27017)." -ForegroundColor Yellow
    exit 1
  }
}

# --- Dump Atlas -> temp dir ---
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dumpDir = Join-Path $env:TEMP "dlaven-atlas-dump-$stamp"
Write-Host "Dumping Atlas to $dumpDir ..." -ForegroundColor Cyan
& $mongodump --uri="$atlas" --out="$dumpDir"
if ($LASTEXITCODE -ne 0) { throw "mongodump failed (exit $LASTEXITCODE)" }

# --- Restore into local, replacing matching collections ---
# Use a host-only URI (no default DB) so the dump's folder structure defines the
# database name; otherwise mongorestore looks for collection files at the top level
# and skips the <db>/ subdirectory.
$localHostUri = [regex]::Replace($local, '(mongodb(\+srv)?://[^/]+)/[^?]*(\?.*)?$', '$1$3')
Write-Host "Restoring into local MongoDB (dropping matching collections first)..." -ForegroundColor Cyan
& $mongorestore --uri="$localHostUri" --drop --dir="$dumpDir"
if ($LASTEXITCODE -ne 0) { throw "mongorestore failed (exit $LASTEXITCODE)" }

# --- Cleanup ---
Remove-Item -Recurse -Force $dumpDir -ErrorAction SilentlyContinue
Write-Host "Done. Local MongoDB now mirrors Atlas." -ForegroundColor Green

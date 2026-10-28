<#
.SYNOPSIS
    startlocal - Scans the project, verifies port availability, and launches local dev servers.
.DESCRIPTION
    Launches Backend and Frontend dev servers with clean port checking and health verification.
.PARAMETER Interactive
    If specified (default), spawns separate visible PowerShell windows for Backend and Frontend.
.PARAMETER Background
    If specified, runs the dev servers as background PowerShell jobs.
.PARAMETER KillStale
    Kills any stale processes occupying the target ports before launching.
#>

[CmdletBinding()]
param(
    [switch]$Interactive = $true,
    [switch]$Background,
    [switch]$KillStale
)

$ErrorActionPreference = "Stop"
$WorkspaceRoot = (Get-Location).Path
if (-not (Test-Path "$WorkspaceRoot\Backend")) {
    $WorkspaceRoot = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  🚀 Startlocal: D'LAVÉN Local Development Environment" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# Step 1: Scan services and ports
$ScanArgs = @("$PSScriptRoot\scan_and_check.mjs", "--json")
if ($KillStale) {
    $ScanArgs += "--kill-stale"
}

$ScanJson = node @ScanArgs | Out-String
$Services = $ScanJson | ConvertFrom-Json

foreach ($s in $Services) {
    Write-Host "• Detected Service: $($s.service) on Port $($s.configuredPort)" -ForegroundColor Yellow
    if (-not $s.isPortAvailable) {
        Write-Warning "Port $($s.configuredPort) is currently occupied by PID: $($s.conflictingPids -join ', ')!"
        if (-not $KillStale) {
            Write-Host "Run with -KillStale to automatically terminate conflicting processes." -ForegroundColor Red
        }
    } else {
        Write-Host "  Port $($s.configuredPort) is FREE." -ForegroundColor Green
    }
}

# If any port is occupied and not kill-stale, warn user
$Blocked = $Services | Where-Object { -not $_.isPortAvailable }
if ($Blocked -and -not $KillStale) {
    Write-Host "`n⚠️ Please free the occupied ports or pass -KillStale to proceed." -ForegroundColor Red
    exit 1
}

Write-Host "`nStarting services from: $WorkspaceRoot" -ForegroundColor Cyan

if ($Background) {
    Write-Host "Starting services in background jobs..." -ForegroundColor Magenta
    Start-Job -Name "dlaven-backend" -ScriptBlock {
        param($root)
        Set-Location "$root\Backend"
        npm run dev
    } -ArgumentList $WorkspaceRoot | Out-Null

    Start-Job -Name "dlaven-frontend" -ScriptBlock {
        param($root)
        Set-Location "$root\Frontend"
        npm run dev
    } -ArgumentList $WorkspaceRoot | Out-Null

    Write-Host "✅ Background jobs launched: 'dlaven-backend' & 'dlaven-frontend'." -ForegroundColor Green
    Write-Host "Use Get-Job and Receive-Job to view logs." -ForegroundColor DarkGray
} else {
    Write-Host "Spawning interactive dev windows for Backend and Frontend..." -ForegroundColor Magenta

    # Launch Backend terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$WorkspaceRoot\Backend`"; Write-Host '--- D`'LAVEN BACKEND (PORT 5000) ---' -ForegroundColor Green; npm run dev"
    
    # Launch Frontend terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$WorkspaceRoot\Frontend`"; Write-Host '--- D`'LAVEN FRONTEND (PORT 3000) ---' -ForegroundColor Cyan; npm run dev"
    
    Write-Host "✅ Separate interactive developer consoles launched." -ForegroundColor Green
}

Write-Host "`nLocal Development URLs:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  ⚙️  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan

# MERKABA geoqode OS - Autonomous GitHub Deployment
# Creates repo, pushes code, verifies deployment

Write-Host "MERKABA geoqode-os: Autonomous Deployment Pipeline" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

$RepoName = "merkaba-geoqode-os"
$Owner = "Onedot2"
$GitHubToken = $env:GH_PAT_KEY

if (-not $GitHubToken) {
    Write-Host "Enter your GitHub Personal Access Token:" -ForegroundColor Yellow
    Write-Host "(Get one from: https://github.com/settings/tokens)" -ForegroundColor Gray
    $tokenSecure = Read-Host "GitHub PAT"
    $GitHubToken = $tokenSecure
}

if (-not $GitHubToken) {
    Write-Host "ERROR: GitHub token required" -ForegroundColor Red
    exit 1
}

Write-Host "Token received (${$GitHubToken.Length} chars)" -ForegroundColor Green
Write-Host ""

# Step 1: Create Repository
Write-Host "Step 1/3: Creating GitHub repository..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $GitHubToken"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "Content-Type" = "application/json"
}

$desc = "Dedicated AI Operating System with GeoQode Language and MERKABA Lattice"
$repoBody = @{
    name = $RepoName
    description = $desc
    private = $false
    auto_init = $false
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest `
        -Uri "https://api.github.com/user/repos" `
        -Method POST `
        -Headers $headers `
        -Body $repoBody `
        -ErrorAction Stop
    
    $repo = $response.Content | ConvertFrom-Json
    Write-Host "CREATED: $($repo.html_url)" -ForegroundColor Green
} catch {
    $msg = $_.ErrorDetails.Message
    if ($msg -match "already exists") {
        Write-Host "Repository already exists" -ForegroundColor Yellow
    } else {
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 2: Push Code
Write-Host "Step 2/3: Pushing code to GitHub..." -ForegroundColor Cyan

$remoteUrl = "https://oauth2:${GitHubToken}@github.com/${Owner}/${RepoName}.git"

try {
    & git remote remove origin 2>$null
    & git remote add origin $remoteUrl
    & git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Code pushed successfully" -ForegroundColor Green
    } else {
        Write-Host "Push failed with code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Verify
Write-Host "Step 3/3: Verifying repository..." -ForegroundColor Cyan

try {
    $check = Invoke-WebRequest `
        -Uri "https://api.github.com/repos/${Owner}/${RepoName}" `
        -Headers $headers `
        -ErrorAction Stop
    
    $data = $check.Content | ConvertFrom-Json
    
    Write-Host "VERIFIED:" -ForegroundColor Green
    Write-Host "  URL: $($data.html_url)"
    Write-Host "  Commits: Check with: git log --oneline"
} catch {
    Write-Host "Verification failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next:"
Write-Host "  1. Visit: https://github.com/${Owner}/${RepoName}"
Write-Host "  2. Setup: npm publish --access=public"
Write-Host "  3. Wire: Import in s4ai-core/src"
Write-Host ""

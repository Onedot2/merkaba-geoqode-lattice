# MERKABA_geoqode-os: GitHub Repository Creation & Push Automation
# For next-gen AI systems - autonomous deployment pipeline

param(
    [Parameter(Mandatory = $false)]
    [string]$GitHubToken = $env:GH_PAT_KEY,

    [Parameter(Mandatory = $false)]
    [string]$RepoName = "merkaba-geoqode-os",

    [Parameter(Mandatory = $false)]
    [string]$Owner = "Onedot2"
)

Write-Host "🌩️  MERKABA_geoqode-os: Autonomous GitHub Deployment Pipeline" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# If no token provided, prompt for it
if (-not $GitHubToken) {
    Write-Host "⚠️  GitHub PAT token required. Enter your GitHub Personal Access Token:" -ForegroundColor Yellow
    Write-Host "   (Get one from: https://github.com/settings/tokens)" -ForegroundColor Gray
    Write-Host ""

    $tokenSecure = Read-Host "GitHub PAT Token (or paste from clipboard)" -AsSecureString
    $GitHubToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($tokenSecure))
}

if (-not $GitHubToken) {
    Write-Host "❌ GitHub PAT token is required" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Token received (${$GitHubToken.Length} characters)" -ForegroundColor Green
Write-Host ""

# Step 1: Create GitHub Repository via API
Write-Host "📦 Step 1/3: Creating GitHub repository..." -ForegroundColor Cyan

$headers = @{
    "Authorization"        = "Bearer $GitHubToken"
    "Accept"               = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "Content-Type"         = "application/json"
}

$repoPayload = @{
    name        = $RepoName
    description = "Dedicated AI Operating System with GeoQode Language & MERKABA 44-Dimension Lattice"
    private     = $false
    auto_init   = $false
} | ConvertTo-Json

$repoPayload = $repoPayload -replace '&', '&amp;'
$repoPayload = @{
    name        = $RepoName
    description = "Dedicated AI Operating System with GeoQode Language and MERKABA 44-Dimension Lattice"
    private     = $false
    auto_init   = $false
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest `
        -Uri "https://api.github.com/user/repos" `
        -Method POST `
        -Headers $headers `
        -Body $repoPayload `
        -ErrorAction Stop

    $repo = $response.Content | ConvertFrom-Json
    Write-Host "✅ Repository created: $($repo.html_url)" -ForegroundColor Green
}
catch {
    $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorBody.errors[0].message -match "already exists") {
        Write-Host "⚠️  Repository already exists" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ Failed to create repository: $($errorBody.message)" -ForegroundColor Red
        Write-Host "   Details: $($errorBody.errors[0].message)" -ForegroundColor Gray
        exit 1
    }
}

Write-Host ""

# Step 2: Push code to GitHub
Write-Host "📤 Step 2/3: Pushing code to GitHub..." -ForegroundColor Cyan

$repoUrl = "https://oauth2:${GitHubToken}@github.com/${Owner}/${RepoName}.git"

try {
    # Set git credentials temporarily (for this push)
    git config --global credential.helper store

    # Attempt push with HTTPS auth
    $output = & git push -u origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code pushed successfully" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Push output:" -ForegroundColor Yellow
        Write-Host $output -ForegroundColor Gray

        # Try alternative: Add token to remote URL
        Write-Host ""
        Write-Host "🔄 Attempting with token-based remote..." -ForegroundColor Cyan
        & git remote remove origin
        & git remote add origin $repoUrl
        $output = & git push -u origin main 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Code pushed successfully (via token-auth)" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Push failed" -ForegroundColor Red
            Write-Host $output -ForegroundColor Gray
            exit 1
        }
    }
}
catch {
    Write-Host "❌ Error during push: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Verification
Write-Host "✨ Step 3/3: Verifying deployment..." -ForegroundColor Cyan

try {
    $repoCheck = Invoke-WebRequest `
        -Uri "https://api.github.com/repos/${Owner}/${RepoName}" `
        -Headers $headers `
        -ErrorAction Stop

    $repoData = $repoCheck.Content | ConvertFrom-Json

    Write-Host "✅ Repository verified:" -ForegroundColor Green
    Write-Host "   📍 URL:      $($repoData.html_url)" -ForegroundColor Cyan
    Write-Host "   📊 Stars:    $($repoData.stargazers_count)" -ForegroundColor Cyan
    Write-Host "   🌿 Branch:   $($repoData.default_branch)" -ForegroundColor Cyan
    Write-Host "   📝 Commits:  (run: git log -1 --pretty=%h)" -ForegroundColor Cyan
}
catch {
    Write-Host "⚠️  Could not verify repository" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🌩️  MERKABA_geoqode-os deployment complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Verify on GitHub: https://github.com/${Owner}/${RepoName}" -ForegroundColor Gray
Write-Host "   2. Setup CI/CD: Add GitHub Actions workflows" -ForegroundColor Gray
Write-Host "   3. Publish npm:  npm publish --access=public" -ForegroundColor Gray
Write-Host "   4. Wire s4ai-core: Import MerkabageoqodeOS" -ForegroundColor Gray
Write-Host ""

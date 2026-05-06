$base = "c:\Users\bradl\source\storm-ai\merkaba-geoqode-lattice\public"
$files = Get-ChildItem $base -Filter "*.html" | Where-Object { $_.Name -ne "index.html" -and $_.Name -notlike "google*" }

$compact = '<a href="/aiosdream">Theatre</a><a href="/vr">'
$compactNew = '<a href="/games">🎮 Games</a><a href="/aiosdream">Theatre</a><a href="/vr">'

$expanded = '        <a href="/aiosdream">Theatre</a>'
$expandedNew = "        <a href=""/games"">🎮 Games</a>`r`n        <a href=""/aiosdream"">Theatre</a>"

$changed = @()
foreach ($f in $files) {
    $c = [IO.File]::ReadAllText($f.FullName)
    $orig = $c
    if (-not $c.Contains('<a href="/games">')) {
        if ($c.Contains($compact)) {
            $c = $c.Replace($compact, $compactNew)
        } elseif ($c.Contains($expanded)) {
            $c = $c.Replace($expanded, $expandedNew)
        }
        if ($c -ne $orig) {
            [IO.File]::WriteAllText($f.FullName, $c, [Text.Encoding]::UTF8)
            $changed += $f.Name
        }
    }
}
Write-Host "Updated $($changed.Count) files:"
$changed | ForEach-Object { Write-Host "  $_" }
Write-Host "Done."

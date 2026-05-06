$file = "c:\Users\bradl\source\storm-ai\merkaba-geoqode-lattice\public\index.html"
$c = [IO.File]::ReadAllText($file)

# Remove B2B block 1: .GEO vs MP4 through end of COMPARISON SLIDES
# Runs from the GEO-vs-MP4 comment up to (but not including) the PHILOSOPHY comment
$start1 = "`n    <!-- ── .GEO vs MP4 — THE FORMAT WAR ──────────────────────────────────── -->"
$end1   = "`n    <!-- -- PHILOSOPHY -->"
$i1 = $c.IndexOf($start1)
$i2 = $c.IndexOf($end1)
if ($i1 -ge 0 -and $i2 -gt $i1) {
    $c = $c.Substring(0, $i1) + $c.Substring($i2)
    Write-Host "Removed B2B block 1 (geo-vs-mp4 through slides): $($i2 - $i1) chars"
} else {
    Write-Host "WARNING: Block 1 markers not found (i1=$i1, i2=$i2)"
}

# Remove B2B block 2: DEV SECTION
$start2 = "`n    <!-- -- BUILD FOR AIOS -->"
$end2   = "`n    <!-- -- FOOTER -->"
$i3 = $c.IndexOf($start2)
$i4 = $c.IndexOf($end2)
if ($i3 -ge 0 -and $i4 -gt $i3) {
    $c = $c.Substring(0, $i3) + $c.Substring($i4)
    Write-Host "Removed B2B block 2 (dev section): $($i4 - $i3) chars"
} else {
    Write-Host "WARNING: Block 2 markers not found (i3=$i3, i4=$i4)"
}

# Update footer: /aios-playground -> /games
$c = $c.Replace('<a href="/aios-playground">🎮 NEXGEN</a>', '<a href="/games">🎮 Games</a>')
Write-Host "Updated footer nav link"

[IO.File]::WriteAllText($file, $c, [Text.Encoding]::UTF8)
Write-Host "Done. New length: $($c.Length) chars"

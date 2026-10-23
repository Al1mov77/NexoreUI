Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Umar\.gemini\antigravity-ide\brain\17466493-d237-4928-b6c4-cfc5a55ef8b9\.user_uploaded\media_1790610120567.jpg"
$outPath = "c:\Users\Umar\Desktop\NexoreUI\apps\docs\public\images\products\headphones-neon.png"

$bmp = [System.Drawing.Bitmap]::new($srcPath)
$w = $bmp.Width
$h = $bmp.Height

$rect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ptr = $data.Scan0
$bytes = [byte[]]::new($w * $h * 4)
[System.Runtime.InteropServices.Marshal]::Copy($ptr, $bytes, 0, $bytes.Length)

# The background is pure black or very dark.
# For headphones, the outer area from edges with brightness < 12 is transparent.
$visited = [bool[]]::new($w * $h)
$queue = [System.Collections.Generic.Queue[int]]::new()

function IsDark($idx) {
    $bIdx = $idx * 4
    $b = $bytes[$bIdx]
    $g = $bytes[$bIdx + 1]
    $r = $bytes[$bIdx + 2]
    return ($r -lt 12 -and $g -lt 12 -and $b -lt 12)
}

for ($x = 0; $x -lt $w; $x++) {
    $idx1 = $x
    if (IsDark $idx1) { $visited[$idx1] = $true; $queue.Enqueue($idx1) }
    $idx2 = ($h - 1) * $w + $x
    if (IsDark $idx2) { $visited[$idx2] = $true; $queue.Enqueue($idx2) }
}
for ($y = 0; $y -lt $h; $y++) {
    $idx1 = $y * $w
    if (-not $visited[$idx1] -and (IsDark $idx1)) { $visited[$idx1] = $true; $queue.Enqueue($idx1) }
    $idx2 = $y * $w + ($w - 1)
    if (-not $visited[$idx2] -and (IsDark $idx2)) { $visited[$idx2] = $true; $queue.Enqueue($idx2) }
}

while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr % $w
    $cy = [Math]::Floor($curr / $w)

    $neighbors = @(
        @($cx - 1, $cy),
        @($cx + 1, $cy),
        @($cx, $cy - 1),
        @($cx, $cy + 1)
    )
    foreach ($n in $neighbors) {
        $nx = $n[0]
        $ny = $n[1]
        if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
            $nidx = $ny * $w + $nx
            if (-not $visited[$nidx]) {
                if (IsDark $nidx) {
                    $visited[$nidx] = $true
                    $queue.Enqueue($nidx)
                }
            }
        }
    }
}

for ($i = 0; $i -lt ($w * $h); $i++) {
    if ($visited[$i]) {
        $bytes[$i * 4 + 3] = 0
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $ptr, $bytes.Length)
$bmp.UnlockBits($data)

$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Saved transparent headphones to $outPath"

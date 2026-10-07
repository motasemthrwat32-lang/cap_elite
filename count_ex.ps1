$c1 = Get-Content -Raw -Encoding UTF8 "C:\Users\M03TSM\.gemini\antigravity\brain\f79359bc-48f6-4bb5-8bbf-919053b88129\.user_uploaded\media_1791308459034.js"
$c2 = Get-Content -Raw -Encoding UTF8 "C:\Users\M03TSM\.gemini\antigravity\scratch\app.js"

$re = [regex]'\{"id":"([^"]+)"'
$m1 = $re.Matches($c1)
$m2 = $re.Matches($c2)

$ids1 = @{}
foreach ($m in $m1) { $ids1[$m.Groups[1].Value] = $true }
$ids2 = @{}
foreach ($m in $m2) { $ids2[$m.Groups[1].Value] = $true }

Write-Host "Total in c1:" $ids1.Count
Write-Host "Total in c2:" $ids2.Count

$missingIn2 = @()
foreach ($k in $ids1.Keys) {
    if (-not $ids2.ContainsKey($k)) {
        $missingIn2 += $k
    }
}
Write-Host "Missing in c2 ($($missingIn2.Count)):" ($missingIn2 -join ", ")

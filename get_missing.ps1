$c1 = Get-Content -Raw -Encoding UTF8 "C:\Users\M03TSM\.gemini\antigravity\brain\f79359bc-48f6-4bb5-8bbf-919053b88129\.user_uploaded\media_1791308459034.js"
$c2 = Get-Content -Raw -Encoding UTF8 "C:\Users\M03TSM\.gemini\antigravity\scratch\app.js"

$re = [regex]'\{"id":"([^"]+)"'
$m1 = $re.Matches($c1)
$m2 = $re.Matches($c2)

$ids2 = @{}
foreach ($m in $m2) { $ids2[$m.Groups[1].Value] = $true }

$lines1 = Get-Content -Encoding UTF8 "C:\Users\M03TSM\.gemini\antigravity\brain\f79359bc-48f6-4bb5-8bbf-919053b88129\.user_uploaded\media_1791308459034.js"

$missingLines = @()
foreach ($line in $lines1) {
    if ($line -match '\{"id":"([^"]+)"') {
        $id = $matches[1]
        if (-not $ids2.ContainsKey($id)) {
            $missingLines += $line.Trim()
        }
    }
}

$missingLines | Out-File -Encoding UTF8 "C:\Users\M03TSM\.gemini\antigravity\scratch\missing_ex.json"
Write-Host "Exported $($missingLines.Count) missing lines."

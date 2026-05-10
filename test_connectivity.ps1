# Test health endpoint
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5 -UseBasicParsing
    Write-Host "Health Check: SUCCESS - $response"
} catch {
    Write-Host "Health Check: FAILED - $($_.Exception.Message)"
}

Write-Host "API Testing Starting..."

# Test 1: Health
Write-Host "[TEST 1] GET /api/health"
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Status: SUCCESS"
    Write-Host "Response: $response"
} catch {
    Write-Host "Status: FAILED"
    Write-Host "Error: $_"
}

Write-Host "Test Complete"

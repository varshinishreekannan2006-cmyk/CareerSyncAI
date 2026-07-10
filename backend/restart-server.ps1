# Restart script for backend server (PowerShell)
# Usage: Run in PowerShell from the workspace root or provide full path.

# Navigate to backend
Set-Location -Path "${PWD}\backend" -ErrorAction SilentlyContinue

# Stop any running node processes (be careful if other node apps are running)
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }

# Option 1: Start in foreground (shows logs in this console)
Write-Output "Starting server in foreground..."
node server.js

# Option 2: Start detached/background (returns immediately)
# Write-Output "Starting server in background..."
# Start-Process -FilePath node -ArgumentList 'server.js' -WorkingDirectory (Get-Location)

# End of script

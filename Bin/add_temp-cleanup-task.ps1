$trigger = New-ScheduledTaskTrigger -Daily -At "00:00"
$action = New-ScheduledTaskAction -Execute "conhost" -Argument "--headless powershell -NonInteractive -NoProfile -Command &{Get-ChildItem -Path `"$PSScriptRoot\temp`" -Recurse -Force | Where-Object { `$_.CreationTime -lt (Get-Date).AddDays(+7) } | Remove-Item -Force -Recurse}"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable
Register-ScheduledTask -TaskName "Aria2 Temp Cleanup" -Trigger $trigger -Action $action -Settings $settings -Force

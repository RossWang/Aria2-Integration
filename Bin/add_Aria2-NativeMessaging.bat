@Echo Off
Title Add Native Messaging Host
set "current=%~dp0"
call :IsAdmin

Reg.exe add "HKCU\SOFTWARE\Mozilla\NativeMessagingHosts\aria2int" /ve /t REG_SZ /d "%current%Aria2-NativeMessaging.json" /f
pause
Exit

:IsAdmin
Reg.exe query "HKU\S-1-5-19\Environment"
If Not %ERRORLEVEL% EQU 0 (
 cls
 Echo You must have administrator rights to continue ...
 Pause
 Exit
)
Cls
goto:eof

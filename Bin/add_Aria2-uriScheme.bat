@Echo Off
Title Add Uri Scheme
set "current=%~dp0"
call :IsAdmin

Reg.exe add "HKCR\Aria2" /ve /t REG_SZ /d "URL:Aria2 Startup Protocol" /f
Reg.exe add "HKCR\Aria2" /v "URL Protocol" /t REG_SZ /d "" /f
Reg.exe add "HKCR\Aria2\DefaultIcon" /ve /t REG_SZ /d "\"%current%aria2Hide.exe\"" /f
Reg.exe add "HKCR\Aria2\shell\open\command" /ve /t REG_SZ /d "\"%current%aria2Hide.exe\" \"%%1\"" /f
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

@setlocal enableextensions
@cd /d "%~dp0"
call npm uninstall -g nexe
call npm install -g nexe
call nexe . --target win32-x86-10.13.0
del "app.exe" /f /q
call npm install -g cspotcode/nexe#19a5046
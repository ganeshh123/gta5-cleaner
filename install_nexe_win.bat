@setlocal enableextensions
@cd /d "%~dp0"
call npm uninstall -g nexe
call npm install -g nexe@5.0.0-beta.4
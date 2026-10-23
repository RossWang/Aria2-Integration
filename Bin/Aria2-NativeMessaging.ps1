$reader = New-Object System.IO.BinaryReader([System.Console]::OpenStandardInput())
$len = $reader.ReadInt32()
$buf = $reader.ReadBytes($len)
$msg = [System.Text.Encoding]::UTF8.GetString($buf)
#"Length is $len" >> debug.log
#"Message is $msg" >> debug.log

$mobj = ConvertFrom-Json $msg

if ($mobj.aria2c -eq "start-with-process") {
	$p = (Get-CimInstance Win32_Process -Filter "ProcessID=$PID").ParentProcessID
	$pp = (Get-CimInstance Win32_Process -Filter "ProcessID=$p").ParentProcessID
	Start-Process -FilePath "aria2c" -WindowStyle Hidden -ArgumentList "-D", "--conf-path=aria2.conf", "--stop-with-process=$pp"
	#"PPID is $pp" >> debug.log
} elseif ($mobj.aria2c -eq "start-detached") {
	Start-Process -FilePath "aria2c" -WindowStyle Hidden -ArgumentList "-D", "--conf-path=aria2.conf"
}

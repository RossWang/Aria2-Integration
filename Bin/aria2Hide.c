#include<stdio.h>
#include<windows.h>

int main (int argc, char **argv){
	PROCESS_INFORMATION pi;
	STARTUPINFO si;
	ZeroMemory(&si, sizeof(si));
	ZeroMemory(&pi, sizeof(pi));
	char cmd[65535] = {0};
    sprintf(cmd, "%s\\..\\", argv[0]);
	chdir(cmd);
	CreateProcess(NULL,"aria2c.exe -D --conf-path=aria2.conf",NULL,NULL,0,CREATE_NO_WINDOW,NULL,NULL,&si,&pi);

	return 0 ;
	}

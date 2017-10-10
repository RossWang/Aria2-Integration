#include<stdio.h>
#include<windows.h>
#include <tlhelp32.h>

int main (int argc, char **argv){
	
	// get parent pid
	int ppid = -1;
	int pid = -1;
    HANDLE h = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    PROCESSENTRY32 pe = { 0 };
    pe.dwSize = sizeof(PROCESSENTRY32);

    pid = GetCurrentProcessId();

    if( Process32First(h, &pe)) {
        do {
            if (pe.th32ProcessID == pid) {
                ppid = pe.th32ParentProcessID;
            }
        } while( Process32Next(h, &pe));
    }

    CloseHandle(h);
	
	// start aria2c
	PROCESS_INFORMATION pi;
	STARTUPINFO si;
	ZeroMemory(&si, sizeof(si));
	ZeroMemory(&pi, sizeof(pi));
	char cmd[65535] = {0};
    sprintf(cmd, "%s\\..\\", argv[0]);
	chdir(cmd);
	if (strcmp(argv[1], "aria2://stop-with-process/") == 0){
		sprintf(cmd, "aria2c.exe -D --conf-path=aria2.conf --stop-with-process=%d", ppid);
		CreateProcess(NULL,cmd,NULL,NULL,0,CREATE_NO_WINDOW,NULL,NULL,&si,&pi);
	}
 	else{
 		sprintf(cmd, "aria2c.exe -D --conf-path=aria2.conf");
		CreateProcess(NULL,cmd,NULL,NULL,0,CREATE_NO_WINDOW,NULL,NULL,&si,&pi);
	}
	return 0 ;
	}

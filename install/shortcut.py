import os, winshell
from win32com.client import Dispatch

dir_path = os.path.dirname(os.path.realpath(__file__))

desktop = winshell.desktop()
path = os.path.join(desktop, "AudioChats.lnk")

target = f"{dir_path}\\..\\run.bat"

wDir = f"{dir_path}\\.."

icon = f"{dir_path}\\..\\docs\\audiochats.ico"

shell = Dispatch('WScript.Shell')
shortcut = shell.CreateShortCut(path)
shortcut.Targetpath = target
shortcut.WorkingDirectory = wDir
shortcut.IconLocation = icon
shortcut.save()
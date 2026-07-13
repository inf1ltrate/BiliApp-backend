import subprocess
import time

# 启动管理端后端服务
print("启动管理端后端服务...")
import os
# 切换到admin-end目录
os.chdir("admin-end")
process = subprocess.Popen([r"C:\Program Files\nodejs\node.exe", "app.js"])

# 等待服务启动
time.sleep(3)
print("管理端后端服务已启动，请访问 http://localhost:8091")

# 保持脚本运行，防止服务被终止
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("正在停止服务...")
    process.terminate()
    process.wait()
    print("服务已停止")
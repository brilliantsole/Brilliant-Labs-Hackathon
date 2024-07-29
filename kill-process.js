const { exec } = require("child_process");

// Get the port from command-line arguments or set a default value
const args = process.argv.slice(2);
const portToFree = args.length === 1 ? parseInt(args[0], 10) : 82;

if (isNaN(portToFree) || portToFree <= 0 || portToFree > 65535) {
  console.error("Invalid port number");
  process.exit(1);
}

function killProcessUsingPort(port) {
  exec(`lsof -i :${port} | awk '{print $2}' | grep -v 'PID'`, (error, stdout) => {
    if (error) {
      console.error("Error:", error);
      return;
    }

    const pids = stdout.trim().split("\n");

    if (pids.length === 0) {
      console.log(`No processes found using port ${port}`);
      return;
    }

    pids.forEach((pid) => {
      exec(`kill -9 ${pid}`, (killError) => {
        if (killError) {
          console.error(`Error killing process ${pid}:`, killError);
        } else {
          console.log(`Process ${pid} using port ${port} has been killed`);
        }
      });
    });
  });
}

killProcessUsingPort(portToFree);

for pid in `pgrep cron`;do
  ps uh --ppid $pid;
done|grep -v CRON

export const formatDurationRelative = (unix, relativeOnly = false) => {
  const date = new Date(parseInt(unix));
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let relativeTimestamp = "Just now";
  const diff = new Date() - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0)
    relativeTimestamp = `${years} year${years > 1 ? "s" : ""} ago`;
  else if (months > 0)
    relativeTimestamp = `${months} month${months > 1 ? "s" : ""} ago`;
  else if (days > 0)
    relativeTimestamp = `${days} day${days > 1 ? "s" : ""} ago`;
  else if (hours > 0)
    relativeTimestamp = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  else if (minutes > 0)
    relativeTimestamp = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  else if (seconds > 0)
    relativeTimestamp = `${seconds} second${seconds > 1 ? "s" : ""} ago`;

  return relativeOnly ? relativeTimestamp : `${month}/${day}/${year} (${relativeTimestamp})`;
}

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Number((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
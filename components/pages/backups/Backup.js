const formatDurationRelative = (unix, relativeOnly = false) => {
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

export default function Backup({ data }) {
  return (
    <div className="bg-white rounded-md py-3 px-6">
      <h1 className="text-xl">{new Date(data.date).toLocaleDateString()}</h1>

      <p className="text-gray-500 text-sm">{formatDurationRelative(new Date(data.date).getTime(), true)}</p>
      <p className="text-gray-500 text-sm">Backup size: {data.size}</p>
      <p className={`text-sm text-gray-500`}>Status: <span className={`${data.status ? "text-green-500" : "text-red-500"} font-semibold`}>{data.status ? "Success" : "Failed"}</span></p>

      <div className="h-[1px] bg-gray-200 my-2"></div>

      <div className="flex flex-col md:flex-row items-center gap-x-2 mb-1">
        <p className="text-gray-500 hover:underline cursor-pointer">View Logs</p>
        <p className="text-gray-200 select-none hidden md:block">|</p>
        <p className="text-gray-500 hover:underline cursor-pointer">Download Backup</p>
        <p className="text-gray-200 select-none hidden md:block">|</p>
        <p className="text-gray-500 hover:underline cursor-pointer text-red-500">Delete Backup</p>
      </div>
    </div>
  )
}
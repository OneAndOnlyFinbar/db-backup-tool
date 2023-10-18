import { formatDurationRelative, bytesToSize } from "lib/utils/Functions";

export default function Backup({ data }) {
  return (
    <div className="bg-white rounded-md py-3 px-6">
      <h1 className="text-xl">{new Date(data.date).toLocaleDateString()}</h1>

      <p className="text-gray-500 text-sm">{formatDurationRelative(new Date(data.date).getTime(), true)}</p>
      <p className="text-gray-500 text-sm">Backup size: {bytesToSize(data.size)}</p>
      <p className={`text-sm text-gray-500`}>Status: <span className={`${data.status ? "text-green-500" : "text-red-500"} font-semibold`}>{data.status ? "Success" : "Failed"}</span></p>

      <div className="h-[1px] bg-gray-200 my-2"></div>

      <div className="flex flex-col md:flex-row items-center gap-x-2 mb-1">
        <p className="text-gray-500 hover:underline cursor-pointer">View Logs</p>
        <p className="text-gray-200 select-none hidden md:block">|</p>
        <p className="text-gray-500 hover:underline cursor-pointer">Download Backup</p>
        <p className="text-gray-200 select-none hidden md:block">|</p>
        <p className="hover:underline cursor-pointer text-red-500">Delete Backup</p>
      </div>
    </div>
  )
}
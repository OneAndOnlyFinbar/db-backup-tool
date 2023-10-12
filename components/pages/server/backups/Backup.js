export default function Backup({data}) {
  return (
    <div className="bg-white rounded-md py-3 px-6">
      <h1 className="text-xl">{new Date().toLocaleDateString()}</h1>

      <p className="text-gray-500 text-sm">3 Hours ago</p>
      <p className="text-gray-500 text-sm">Backup size: {data.size}</p>
      <p className="text-sm text-gray-500">Backup Status: <span className="font-semibold text-green-500">Completed</span>
      </p>
      <p className="text-sm text-gray-500">Backup Status: <span className="font-semibold text-yellow-600">Running...</span>
      </p>
      <p className="text-sm text-gray-500">Backup
        Status: <span className="font-semibold text-red-500">Failed</span></p>

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
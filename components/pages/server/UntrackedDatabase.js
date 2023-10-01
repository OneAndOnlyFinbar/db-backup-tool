export default function UntrackedDatabase ({ database, index, setTracked, setUntracked, tracked, untracked}) {
  const track = () => {
    fetch(`/api/servers/${database.serverId}`, {
      method: 'POST',
      body: JSON.stringify({
        op: 'track',
        data: {
          tracked: true,
          databaseName: database.name
        }
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setTracked([...tracked, database]);
          setUntracked(untracked.filter(db => db.name !== database.name));
        }
      });
  }
  return (
    <div className="flex flex-col w-full bg-white rounded-lg p-2 px-5 shadow-sm mt-2" key={index}>
      <h1 className="font-semibold text-xl">{database.name}</h1>
      <p className="text-sm text-gray-500"><span className="font-medium">{database.tableCount}</span> tables</p>
      <div className="h-px bg-gray-200 my-2"></div>
      <div className="flex flex-row items-center gap-x-2 mb-1">
        <p className="text-gray-500 hover:underline cursor-pointer" onClick={track}>Start Tracking</p>
      </div>
    </div>
  )
}
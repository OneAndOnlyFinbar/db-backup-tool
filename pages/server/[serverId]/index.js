import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function Server(props) {
  const [tracked, setTracked] = useState([]);
  const [untracked, setUntracked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    return () => {
      fetch(`/api/servers/${props.serverId}`, {
        method: 'GET'
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error)
            setLoadingError(data.error);
          else {
            setTracked(data.databases.filter(db => db.tracked));
            setUntracked(data.databases.filter(db => !db.tracked));
          }
          setLoading(false);
        });
    };
  }, []);

  const Database = ({ database, index }) => {
    const [editing, setEditing] = useState(false);
    const [retention, setRetention] = useState(database.retentionValue);
    const [retentionUnit, setRetentionUnit] = useState(database.retentionUnit);
    const [frequency, setFrequency] = useState(database.frequencyValue);
    const [frequencyUnit, setFrequencyUnit] = useState(database.frequencyUnit);

    return (
      <div className="flex flex-col w-full bg-white rounded-lg p-2 px-5 shadow-sm mt-2" key={index}>
        <h1 className="font-semibold text-xl">{database.name}</h1>
        <p className="text-sm text-gray-500"><span className="font-semibold">3</span> tables</p>
        <p className="text-sm text-gray-500"><span className="font-semibold">7</span> backups</p>
        <p className="text-sm text-gray-500 flex flex-row gap-x-1 items-center">Retention Period: {editing
          ? (
            <div className="flex flex-row gap-x-2">
              <input type="number" className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-500 focus:outline-none focus:ring-[1px] focus:ring-blue-500 focus:border-transparent" value={retention} onChange={e => setRetention(e.target.value)}/>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-500 focus:outline-none focus:ring-[1px] focus:ring-blue-500 focus:border-transparent" value={retentionUnit} onChange={e => setRetentionUnit(e.target.value)}>
                <option value="hour">Hour{retention != 1 && 's'}</option>
                <option value="day">Day{retention != 1 && 's'}</option>
                <option value="week">Week{retention != 1 && 's'}</option>
                <option value="month">Month{retention != 1 && 's'}</option>
              </select>
            </div>
          )
          : <span className="font-semibold">for {retention} {retentionUnit}{retention != 1 && 's'}</span>
        }</p>
        <p className="text-sm text-gray-500 flex flex-row gap-x-1 items-center">Backup Frequency: {editing
          ? (
            <div className="flex flex-row gap-x-2 mt-2">
              <input type="number" className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-500 focus:outline-none focus:ring-[1px] focus:ring-blue-500 focus:border-transparent" value={frequency} onChange={e => setFrequency(e.target.value)}/>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-500 focus:outline-none focus:ring-[1px] focus:ring-blue-500 focus:border-transparent" value={frequencyUnit} onChange={e => setFrequencyUnit(e.target.value)}>
                <option value="hour">Hour{frequency != 1 && 's'}</option>
                <option value="day">Day{frequency != 1 && 's'}</option>
                <option value="week">Week{frequency != 1 && 's'}</option>
                <option value="month">Month{frequency != 1 && 's'}</option>
              </select>
            </div>
          )
          :
          <span className="font-semibold">every {frequency != 1 && frequency} {frequencyUnit}{frequency != 1 && 's'}</span>
        }</p>
        <p className="text-sm text-gray-500">Last backup: <span className="font-semibold">1 hour ago</span></p>
        <p className="text-sm text-gray-500">Current Status: <span className="font-semibold text-green-500">Backup Completed</span>
        </p>
        <p className="text-sm text-gray-500">Current Status: <span className="font-semibold text-yellow-600">Running backup</span>
        </p>
        <p className="text-sm text-gray-500">Current
          Status: <span className="font-semibold text-red-500">Backup Failed</span></p>
        <div className="h-px bg-gray-200 my-2"></div>
        <div className="flex flex-row items-center gap-x-2 mb-1">
          <p className="text-gray-500 hover:underline cursor-pointer">Backup Now</p>
          <p className="text-gray-200 select-none">|</p>
          <p className="text-gray-500 hover:underline cursor-pointer">View Backups</p>
          <p className="text-gray-200 select-none">|</p>
          <p className="text-gray-500 hover:underline cursor-pointer" onClick={() => setEditing(!editing)}>{editing ? 'Save' : 'Edit'}</p>
          <p className="text-gray-200 select-none">|</p>
          <p className="text-red-500 hover:underline cursor-pointer">Untrack</p>
        </div>
      </div>
    )
  }

  const UntrackedDatabase = ({ database, index }) => {
    const track = () => {
      fetch(`/api/servers/${props.serverId}`, {
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
          if (data.error)
            setLoadingError(data.error);
          else {
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

  return (
    <Layout>
      <title>Server</title>
      <div className="flex flex-col w-[1000px] mt-8 mx-auto">
        {tracked.length > 0 && (
          <>
            <h1 className="text-2xl font-light select-none">Tracked Databases</h1>

            {tracked.map((database, index) => (
              <Database database={database} index={index} key={index}/>
            ))}
          </>
        )}

        {untracked.length > 0 && (
          <>
            <h1 className="text-2xl font-light select-none mt-4">Untracked Databases</h1>

            {untracked.map((database, index) => (
              <UntrackedDatabase database={database} index={index} key={index}/>
            ))}
          </>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false
      }
    }
  }

  const { serverId } = context.query;

  if (!serverId)
    return {
      redirect: {
        destination: '/servers',
        permanent: false
      }
    }

  return {
    props: {
      serverId
    }
  }
}
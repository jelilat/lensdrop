import {
  useAccount,
  useConnect,
  useDisconnect
} from "wagmi";
global.Buffer = global.Buffer || require('buffer').Buffer;

export default function Connect() {
  const { data: account } = useAccount();
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  if (account) {
    return (
      <div className="m-5">
        <div>Connected to {account?.connector?.name}</div>
        <button
          className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="grid-rows-4 m-5">
      {connectors.map((connector, index) => (
        <div key={index}>
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
          className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isConnecting &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button></div>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}
